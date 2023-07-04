import Fuse from "fuse.js";
import debounce from "lodash/debounce";
import { useEffect, useState } from "react";

export type Entry = {
  component: string;
  path: string;
};

export type ResultEntry = {
  item: Entry & {
    parents: Entry[];
    pageUrl: string;
  };
};

type RenderChildrenFunction = {
  onChange: (event: string) => void;
  value: string;
  results: ResultEntry[];
};

export type ProviderProps = {
  /**
   * Render children function
   */
  children: ({
    onChange,
    value,
    results,
  }: RenderChildrenFunction) => JSX.Element;
  /**
   * Timeout provided to the `debounce` function upon providing input to the `Search Input`
   */
  fetchDebounceTimeout?: 500;
  /**
   * 1st generated JSON file from `compute-index` script
   */
  pagesDictionary: any;
  /**
   * 2nd generated JSON file from `compute-index` script
   */
  fuseIndex: any;
  /**
   * Fuse options passed to the Fuse constructor
   * @see https://fusejs.io/api/options.html
   */
  fuseOptions?: Fuse.IFuseOptions<unknown> | undefined;
};

export const Provider = ({
  children,
  fetchDebounceTimeout = 500,
  pagesDictionary,
  fuseIndex,
  fuseOptions,
}: ProviderProps) => {
  const [fuse] = useState(() => {
    const parsedFuseIndex = Fuse.parseIndex(fuseIndex);
    return new Fuse(
      pagesDictionary,
      { keys: [["component"]], ...fuseOptions },
      parsedFuseIndex,
    );
  });
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | { component: string }>(
    "",
  );

  useEffect(() => {
    const fetchFromFuse = debounce(async () => {
      if (fuse) {
        const results = fuse.search(searchTerm);
        setResults(results as ResultEntry[]);
      }
    }, fetchDebounceTimeout);
    void fetchFromFuse();
    return () => {
      fetchFromFuse.cancel();
    };
  }, [searchTerm]);

  const valueSearchInput =
    typeof searchTerm === "string" ? searchTerm : searchTerm.component;

  return children({
    value: valueSearchInput,
    onChange: (str) => setSearchTerm(str),
    results,
  });
};
