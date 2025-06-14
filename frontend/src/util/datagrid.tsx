import { DateTime } from "luxon"
import type { GridValidRowModel } from "@mui/x-data-grid-premium"
import { GridColDef } from "@mui/x-data-grid-premium"
import { DateTimeFormatOptions } from "luxon/src/misc"

export function temporalColumn<Row extends GridValidRowModel>(
    col: GridColDef<Row, Date | null, string>,
    format?: DateTimeFormatOptions,
): GridColDef<Row, Date | null, string> {
    return {
        ...col,
        type: "dateTime",
        flex: 0,
        valueGetter: (value: any, _row: Row, _column: GridColDef<Row, Date | null, string>): Date | null => {
            if (!value) {
                return null
            } else if (typeof value === "string") {
                return DateTime.fromISO(value).toJSDate()
            } else if (value instanceof DateTime) {
                return value.toJSDate()
            } else {
                throw new Error(`invalid date value (type ${typeof value}): ${value}`)
            }
        },
        valueFormatter: (value: Date, _row: Row, _column: GridColDef<Row, Date | null, string>): string =>
            value ? DateTime.fromJSDate(value).toLocaleString(format || DateTime.DATE_SHORT) : "",
    }
}
