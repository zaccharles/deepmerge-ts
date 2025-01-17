import type { RecordProperty } from "./basics";
import type {
  DeepMergeHKT,
  DeepMergeLeafURI,
  DeepMergeMergeFunctionsURIs,
  DeepMergeMergeFunctionURItoKind,
} from "./merging";
import type {
  FlatternAlias,
  FilterOutNever,
  IsNever,
  OptionalKeysOf,
  RequiredKeysOf,
  UnionMapKeys,
  UnionMapValues,
  UnionSetValues,
  ValueOfKey,
} from "./utils";

/**
 * The default merge function to merge records with.
 */
type DeepMergeRecordsDefaultURI = "DeepMergeRecordsDefaultURI";

/**
 * The default merge function to merge arrays with.
 */
type DeepMergeArraysDefaultURI = "DeepMergeArraysDefaultURI";

/**
 * The default merge function to merge sets with.
 */
type DeepMergeSetsDefaultURI = "DeepMergeSetsDefaultURI";

/**
 * The default merge function to merge maps with.
 */
type DeepMergeMapsDefaultURI = "DeepMergeMapsDefaultURI";

/**
 * The default merge functions to use when deep merging.
 */
export type DeepMergeMergeFunctionsDefaultURIs = {
  DeepMergeRecordsURI: DeepMergeRecordsDefaultURI;
  DeepMergeArraysURI: DeepMergeArraysDefaultURI;
  DeepMergeSetsURI: DeepMergeSetsDefaultURI;
  DeepMergeMapsURI: DeepMergeMapsDefaultURI;
  DeepMergeOthersURI: DeepMergeLeafURI;
};

/**
 * A union of all the props that should not be included in type information for
 * merged records.
 */
type BlacklistedRecordProps = "__proto__";

/**
 * Deep merge records.
 */
export type DeepMergeRecordsDefaultHKT<
  Ts extends ReadonlyArray<unknown>,
  MF extends DeepMergeMergeFunctionsURIs
> = Ts extends readonly [unknown, ...unknown[]]
  ? FlatternAlias<
      Omit<
        DeepMergeRecordsDefaultHKTInternalProps<Ts, MF>,
        BlacklistedRecordProps
      >
    >
  : {};

/**
 * Deep merge record props.
 */
type DeepMergeRecordsDefaultHKTInternalProps<
  Ts extends readonly [unknown, ...unknown[]],
  MF extends DeepMergeMergeFunctionsURIs
> = {
  [K in OptionalKeysOf<Ts>]?: DeepMergeHKT<
    FilterOutNever<
      DeepMergeRecordsDefaultHKTInternalPropsToMerge<
        DeepMergeRecordsDefaultHKTInternalPropValue<Ts, K>
      >
    >,
    MF
  >;
} & {
  [K in RequiredKeysOf<Ts>]: DeepMergeHKT<
    FilterOutNever<
      DeepMergeRecordsDefaultHKTInternalPropsToMerge<
        DeepMergeRecordsDefaultHKTInternalPropValue<Ts, K>
      >
    >,
    MF
  >;
};

/**
 * Get the properties to merge.
 */
type DeepMergeRecordsDefaultHKTInternalPropsToMerge<
  Ts extends readonly [unknown, unknown]
> = Ts extends readonly [infer First, infer Second]
  ? IsNever<First> extends true
    ? Second extends readonly [unknown, unknown]
      ? DeepMergeRecordsDefaultHKTInternalPropsToMerge<Second>
      : Second extends readonly [unknown]
      ? Second
      : []
    : Second extends readonly [unknown, unknown]
    ? [First, ...DeepMergeRecordsDefaultHKTInternalPropsToMerge<Second>]
    : Second extends readonly [unknown]
    ? [First, Second[0]]
    : []
  : never;

/**
 * Get the value of the property.
 */
type DeepMergeRecordsDefaultHKTInternalPropValue<
  Ts extends readonly [unknown, ...unknown[]],
  K extends RecordProperty
> = Ts extends readonly [infer Head, ...infer Rest]
  ? Head extends Record<RecordProperty, unknown>
    ? Rest extends readonly [unknown, ...unknown[]]
      ? [
          ValueOfKey<Head, K>,
          DeepMergeRecordsDefaultHKTInternalPropValue<Rest, K>
        ]
      : [ValueOfKey<Head, K>]
    : never
  : never;

/**
 * Deep merge 2 arrays.
 */
export type DeepMergeArraysDefaultHKT<
  Ts extends ReadonlyArray<unknown>,
  MF extends DeepMergeMergeFunctionsURIs
> = Ts extends [infer Head, ...infer Rest]
  ? Head extends ReadonlyArray<unknown>
    ? Rest extends [ReadonlyArray<unknown>, ...ReadonlyArray<unknown[]>]
      ? [...Head, ...DeepMergeArraysDefaultHKT<Rest, MF>]
      : Head
    : never
  : never;

/**
 * Deep merge 2 sets.
 */
export type DeepMergeSetsDefaultHKT<
  Ts extends ReadonlyArray<unknown>,
  MF extends DeepMergeMergeFunctionsURIs
> = Set<UnionSetValues<Ts>>;

/**
 * Deep merge 2 maps.
 */
export type DeepMergeMapsDefaultHKT<
  Ts extends ReadonlyArray<unknown>,
  MF extends DeepMergeMergeFunctionsURIs
> = Map<UnionMapKeys<Ts>, UnionMapValues<Ts>>;

/**
 * Get the merge functions with defaults apply from the given subset.
 */
export type GetDeepMergeMergeFunctionsURIs<
  PMF extends Partial<DeepMergeMergeFunctionsURIs>
> = {
  // prettier-ignore
  DeepMergeRecordsURI:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PMF["DeepMergeRecordsURI"] extends keyof DeepMergeMergeFunctionURItoKind<any, any>
      ? PMF["DeepMergeRecordsURI"]
      : DeepMergeRecordsDefaultURI;

  // prettier-ignore
  DeepMergeArraysURI:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PMF["DeepMergeArraysURI"] extends keyof DeepMergeMergeFunctionURItoKind<any, any>
      ? PMF["DeepMergeArraysURI"]
      : DeepMergeArraysDefaultURI;

  // prettier-ignore
  DeepMergeSetsURI:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PMF["DeepMergeSetsURI"] extends keyof DeepMergeMergeFunctionURItoKind<any, any>
      ? PMF["DeepMergeSetsURI"]
      : DeepMergeSetsDefaultURI;

  // prettier-ignore
  DeepMergeMapsURI:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PMF["DeepMergeMapsURI"] extends keyof DeepMergeMergeFunctionURItoKind<any, any>
      ? PMF["DeepMergeMapsURI"]
      : DeepMergeMapsDefaultURI;

  // prettier-ignore
  DeepMergeOthersURI:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PMF["DeepMergeOthersURI"] extends keyof DeepMergeMergeFunctionURItoKind<any, any>
      ? PMF["DeepMergeOthersURI"]
      : DeepMergeLeafURI;
};
