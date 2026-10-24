// A tag is shown under the filter bar when a filter is selected.
// Tags show what filters have been selected
// On click, the tag is removed and the filter is reset

export default function Tag({ type, value, updateField }) {
  const label =
    type === "category"
      ? `Genre: ${value}`
      : type === "price"
        ? `Book ${value}`
        : value;

  return (
    <span className="">
      {label}
      <button
        type="button"
        aria-label="Remove"
        onClick={() => updateField(type, "")}
      >
        X
      </button>
    </span>
  );
}
