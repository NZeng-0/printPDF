$(function () {

    // 判断是否是同一行合并列
    let isSameLine = false

    // 保存总行数和总列数
    let totalRow = 0
    let totalCol = 0
    $('#load').click(function () {
        // 获取行数
        let row = $('#row').val();
        // 获取列数
        let col = $('#col').val();
        totalRow = row
        totalCol = col
        // 调用方法生成表格
        load(row, col);
    })
    $('#edit').click(() => {
        // 获取修改行
        let row = $('#inputRow').val()
        // 获取修改列
        let col = $('#inputCol').val()
        // 获取添加标签类型
        let type = $('#inputType').val()
        // 获取添加标签内容
        let content = $('#inputContent').val()
        // 获取行合并值
        let rowSpan = $('#inputRowspan').val()
        // 获取列合并值
        let colSpan = $('#inputColspan').val()
        // 获取单元格宽度
        let width = $('#inputWidth').val()
        // 获取单元格高度
        let height = $('#inputHeight').val()
        // 获取水平对齐方向
        let levelDire = $('#level option:selected').val()

        // 行值类型转换 string -> number
        row = Number(row) - 1
        // 列值类型转换 string -> number
        col = Number(col) - 1
        // 如果合并行后 输入行不减1

        // 获取具体行列交叉单元格
        let cell = $(`#${row + '-' + col}`)
        // 判断标签类型是否是text
        // 是 标签类型改为 input输入框
        // 不是 标签类型以及输入值不变
        if (type === 'text') {
            cell.append(`<input type="text">`)
        } else {
            // 如果选中文字对齐方式 append时字符串加入行内style
            if (levelDire != '') {
                cell
                    .append(`<${type} style='text-align:${levelDire};'>${content}</${type}>`)
            } else {
                cell
                    .append(`<${type}>${content}</${type}>`)
            }
        }
        /**
         * 第一种情况：在一行内进行列合并
         * 第二种情况：同一列中进行行合并
         * 第三种情况：不同行不同列同时进行列合并和行合并
        */

        // 第一种情况 两个值均不为空时
        if (colSpan != '' && rowSpan != '') {
            // 合并列
            cell.attr("colSpan", Number(colSpan))
            // 合并行
            cell.attr("rowSpan", Number(rowSpan))
            // 列合并后多余单元格
            let surplusCol = colSpan - 1
            // 行合并数
            let rowMerge = rowSpan - 1

            if (isSameLine) {
                // 列合并
                for (let i = 1; i <= surplusCol + 1; i++) {
                    isSameLine = false
                    $(`#${row}-${totalCol - i}`).remove()
                    /* 
                        先合并两列 再合并2列会多出一列
                        第二次循环时会少循环一个
                    */
                }
                return
            } else {
                // 列合并
                for (let i = 1; i <= surplusCol; i++) {
                    if ((Number(colSpan)) >= 4 / 2 && (Number(colSpan)) < 4) {
                        isSameLine = true
                    }
                    $(`#${row}-${totalCol - i}`).remove()
                    /* 
                        先合并两列 再合并2列会多出一列
                        第二次循环时会少循环一个
                    */
                }
                return
            }
            // 如果行合并合并行数为一不进行“行合并”
            if (Number(rowSpan) == 1) {
                return
            }
            // 行合并
            for (let i = 1; i <= surplusCol + 1; i++) {
                //合并之后的行全部单元格删除 所以surplusCol+1
                $(`#${row + rowMerge}-${totalCol - i}`).remove()
            }
            /* 
                问题 合并行后 id不变，新输入的id匹配不到节点

            */
        }
        // 第二种情况 
        // 判断列合并值是否为空字符串
        else if (colSpan != '') {
            // 合并指定数量单元格
            cell.attr("colSpan", Number(colSpan))
            // 删除多余单元格
            let deleteNum = colSpan - 1
            // 合并数量减去基数 1 得到需要删除单元格的数量
            for (let i = 1; i <= deleteNum; i++) {
                // 循环小于需要删除单元格数量
                // 总列数减去当前循环数等于最后一个单元格（i增加时，列数递减。达到从后往前删除）
                $(`#${row}-${totalCol - i}`).remove()
            }
        }
        // 第三种情况
        // 判断合并行值是否为空字符串
        else if (rowSpan != '') {
            // 行合并
            cell.attr("rowSpan", Number(rowSpan))
            // 合并行数
            let deleteNum = rowSpan - 1
            // 合并数量减去基数 1 得到需要删除单元格的数量
            for (let i = 1; i <= deleteNum; i++) {
                // 循环小于需要删除单元格数量
                // 总列数减去当前循环数等于最后一个单元格（i增加时，列数递减。达到从后往前删除）
                $(`#${row + deleteNum}-${totalCol - i}`).remove()
            }
        }
    })
})

/**
 * 生成表格方法
 * @row 行
 * @col 列
*/
function load(row, col) {
    // 模板字符串
    let tab = `<table style="border: 1px solid black;">`
    // 遍历输入行数
    for (let i = 0; i < row; i++) {
        tab = tab + `<tr>`
        // 遍历输入列数
        for (let j = 0; j < col; j++) {
            // 生成单元格
            tab = tab + `<td id="${i + '-' + j}" style="width:135px;height:50px"></td>`
        }
        tab = tab + '</tr>'
    }
    tab = tab + '</table>'
    // 添加html字符串
    $('#app').append(tab)
}

