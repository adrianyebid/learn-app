/**
 * Table - lightweight, prop-driven data table (markup skeleton).
 * In a later stage this can be swapped for MUI / ag-grid as the PDF suggests.
 * columns: [{ key, label }]   rows: [{ ...cells }]
 */
function Table({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-surface shadow-sm ring-1 ring-line">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-brand-light text-brand">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-line hover:bg-brand-light/40">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-ink">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
