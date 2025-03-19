export const COLORS = {
    BLACK: [0, 0, 0],
    WHITE: [255, 255, 255],
    LIGHT_GRAY: [231, 230, 230],
}

export const SIZES = {
    HEADER_FONT: 10,
    COLUMN_FONT: 7,
    NARROW_WIDTH: 18,
    MEDIUM_WIDTH: 50,
    MATERIAL_WIDTHS: [20, 70, 30, 40, 40],
    CELL_PADDING: 2,
}

export class HeaderStyles {
    static Base = {
        lineWidth: 0.5,
        fontSize: SIZES.HEADER_FONT,
        cellPadding: SIZES.CELL_PADDING,
    }

    static CellPadding = {
        ...HeaderStyles.Base,
        halign: 'left',
        fillColor: COLORS.BLACK,
        textColor: 'white',
    }

    static Default = {
        ...HeaderStyles.Base,
        halign: 'center',
        fillColor: COLORS.LIGHT_GRAY,
        textColor: 'black',
    }

    static Materials = {
        ...HeaderStyles.Base,
        halign: 'center',
        fillColor: COLORS.BLACK,
        textColor: 'white', 
    }
}

export class ColumnStyles {
    static BaseColumn = {
        textColor: 'black',
        lineWidth: 0.5,
        fontSize: SIZES.COLUMN_FONT,
        fillColor: COLORS.WHITE,
        cellPadding: SIZES.CELL_PADDING,
    }

    static createColumnStyle(overrides = {}) {
        return { ...ColumnStyles.BaseColumn, ...overrides }
    }

    static generateColumns(count, baseStyle = { halign: 'left' }) {
        return Object.fromEntries(
            Array(count).fill().map((_, i) => [i, ColumnStyles.createColumnStyle(baseStyle)])
        )
    }

    static AutoAndCenter = {
        0: ColumnStyles.createColumnStyle({ cellWidth: 'auto', halign: 'left' }),
        1: ColumnStyles.createColumnStyle({ cellWidth: SIZES.MEDIUM_WIDTH, halign: 'center' }),
    }

    static Skills = {
        0: ColumnStyles.createColumnStyle({ cellWidth: 'auto', halign: 'left' }),
        1: ColumnStyles.createColumnStyle({ cellWidth: SIZES.NARROW_WIDTH, halign: 'center' }),
        2: ColumnStyles.createColumnStyle({ cellWidth: SIZES.NARROW_WIDTH, halign: 'left' }),
        3: ColumnStyles.createColumnStyle({ cellWidth: 'auto', halign: 'center' }),
        4: ColumnStyles.createColumnStyle({ cellWidth: SIZES.NARROW_WIDTH, halign: 'center' }),
        5: ColumnStyles.createColumnStyle({ cellWidth: SIZES.NARROW_WIDTH, halign: 'left' }),
    }

    static Center = {
        0: ColumnStyles.createColumnStyle({ halign: 'center' }),
        1: ColumnStyles.createColumnStyle({ halign: 'center' }),
    }

    static Left = ColumnStyles.generateColumns(6, { halign: 'left' })

    static FirstCenterRemainderLeft = Object.fromEntries(
        Array(6).fill().map((_, i) => [
            i,
            ColumnStyles.createColumnStyle({ halign: i === 0 ? 'center' : 'left' }),
        ])
    )

    static Materials = Object.fromEntries(
        SIZES.MATERIAL_WIDTHS.map((width, i) => [
            i,
            ColumnStyles.createColumnStyle({ cellWidth: width, halign: 'center' }),
        ])
    )
}