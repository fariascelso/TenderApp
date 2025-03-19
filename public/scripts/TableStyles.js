// Constantes para cores e tamanhos consistentes
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
    MATERIAL_WIDTHS: [20, 70, 30, 40, 40], // Larguras específicas para materiais
    CELL_PADDING: 2, // Espaçamento interno nas células
}

// Estilos para cabeçalhos de tabelas no PDF
export class HeaderStyles {
    // Estilo base comum a todos os cabeçalhos
    static Base = {
        lineWidth: 0.5,
        fontSize: SIZES.HEADER_FONT,
        cellPadding: SIZES.CELL_PADDING, // Adicionado para melhor espaçamento
    }

    // Cabeçalho com preenchimento, usado para títulos principais com fundo preto
    static CellPadding = {
        ...HeaderStyles.Base,
        halign: 'left',
        fillColor: COLORS.BLACK,
        textColor: 'white',
    }

    // Cabeçalho padrão com fundo cinza claro, usado em tabelas gerais
    static Default = {
        ...HeaderStyles.Base,
        halign: 'center',
        fillColor: COLORS.LIGHT_GRAY,
        textColor: 'black',
    }

    // Cabeçalho específico para tabela de materiais, com fundo preto e centralizado
    static Materials = {
        ...HeaderStyles.Base,
        halign: 'center',
        fillColor: COLORS.BLACK,
        textColor: 'white', // Garante texto branco
    }
}

// Estilos para colunas de tabelas no PDF
export class ColumnStyles {
    // Estilo base para todas as colunas
    static BaseColumn = {
        textColor: 'black',
        lineWidth: 0.5,
        fontSize: SIZES.COLUMN_FONT,
        fillColor: COLORS.WHITE,
        cellPadding: SIZES.CELL_PADDING, // Adicionado para melhor espaçamento
    }

    // Função auxiliar para criar estilos de colunas personalizados
    static createColumnStyle(overrides = {}) {
        return { ...ColumnStyles.BaseColumn, ...overrides }
    }

    // Função para gerar estilos para um número variável de colunas
    static generateColumns(count, baseStyle = { halign: 'left' }) {
        return Object.fromEntries(
            Array(count).fill().map((_, i) => [i, ColumnStyles.createColumnStyle(baseStyle)])
        )
    }

    // Estilo para tabelas com duas colunas: descrição à esquerda e valor centralizado
    static AutoAndCenter = {
        0: ColumnStyles.createColumnStyle({ cellWidth: 'auto', halign: 'left' }),
        1: ColumnStyles.createColumnStyle({ cellWidth: SIZES.MEDIUM_WIDTH, halign: 'center' }),
    }

    // Estilo para tabelas de equipamentos ou serviços com múltiplas colunas
    static Skills = {
        0: ColumnStyles.createColumnStyle({ cellWidth: 'auto', halign: 'left' }),
        1: ColumnStyles.createColumnStyle({ cellWidth: SIZES.NARROW_WIDTH, halign: 'center' }),
        2: ColumnStyles.createColumnStyle({ cellWidth: SIZES.NARROW_WIDTH, halign: 'left' }),
        3: ColumnStyles.createColumnStyle({ cellWidth: 'auto', halign: 'center' }),
        4: ColumnStyles.createColumnStyle({ cellWidth: SIZES.NARROW_WIDTH, halign: 'center' }),
        5: ColumnStyles.createColumnStyle({ cellWidth: SIZES.NARROW_WIDTH, halign: 'left' }),
    }

    // Estilo para tabelas simples com texto centralizado em todas as colunas
    static Center = {
        0: ColumnStyles.createColumnStyle({ halign: 'center' }),
        1: ColumnStyles.createColumnStyle({ halign: 'center' }),
    }

    // Estilo para tabelas com texto alinhado à esquerda em todas as colunas (6 colunas)
    static Left = ColumnStyles.generateColumns(6, { halign: 'left' })

    // Estilo para tabelas com a primeira coluna centralizada e as demais à esquerda (6 colunas)
    static FirstCenterRemainderLeft = Object.fromEntries(
        Array(6).fill().map((_, i) => [
            i,
            ColumnStyles.createColumnStyle({ halign: i === 0 ? 'center' : 'left' }),
        ])
    )

    // Estilo específico para tabela de materiais, com larguras fixas e centralizado
    static Materials = Object.fromEntries(
        SIZES.MATERIAL_WIDTHS.map((width, i) => [
            i,
            ColumnStyles.createColumnStyle({ cellWidth: width, halign: 'center' }),
        ])
    )
}