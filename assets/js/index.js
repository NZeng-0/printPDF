// 每个单元格对象存放数组
let list = []

$(function () {

    // 判断是否是同一行合并列
    let isSameLine = false

    // 保存总列数
    let totalCol = 0

    $('#getListInfo').click(() => {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/Interface_war/test",
            contentType: "application/json", //必须这样写
            dataType: "json",
            data: JSON.stringify(list),
            success: function (data) {
                console.log('ok');
            }
        })
    })

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
        // 获取添加行
        let row = $('#inputRow').val()
        // 获取添加列
        let col = $('#inputCol').val()
        // 获取添加标签类型
        let type = $('#inputType option:selected').val()
        // 获取添加标签内容
        let content = $('#inputContent').val()
        // 获取行合并值
        let rowSpan = $('#inputRowspan').val()
        // 获取列合并值
        let colSpan = $('#inputColspan').val()

        // 行值类型转换 string -> number
        row = Number(row) - 1
        // 列值类型转换 string -> number
        col = Number(col) - 1
        // 如果合并行后 输入行不减1

        // 获取具体行列交叉单元格
        cell = $(`#${row + '-' + col}`)
        // 判断标签类型是否是text
        // 是 标签类型改为 input输入框
        // 不是 标签类型以及输入值不变
        if (type === 'text') {
            cell.append(`<input 
                            type="text" 
                            id="${row + '-' + col}-i" 
                            class="form-control" 
                            OnFocus="updateCellName(this)" 
                        >`)
        } else {
            cell.append(`<${type}> ${content} </${type}>`)
        }

        // 调用方法获取单元格信息
        getCellInfo(`#${row + '-' + col}`, list, rowSpan, colSpan)

        // 两个合并值均不为空时
        if (colSpan != '' && rowSpan != '') {
            // 合并列
            cell.attr("colSpan", Number(colSpan))
            // 合并行
            cell.attr("rowSpan", Number(rowSpan))
            // 列合并后多余单元格 如果合并列等于 总列数除以二的值 需要并其他列合并多删除一个单元格
            colSpan = Number(colSpan) === 4 / 2 ? Number(colSpan) : Number(colSpan) - 1
            // 列合并
            for (let i = 1; i <= colSpan; i++) {
                isSameLine = false
                $(`#${row}-${totalCol - i}`).remove()
            }
        }
    })

    /**
     * 生成表格方法
     * @row 行
     * @col 列
    */
    function load(row, col) {
        // 模板字符串
        let tab = `<div class="panel panel-default"> 
                        <div class="panel-body"> 
                            <table class="table table-bordered table-hover table-condensed" >`
        // 遍历输入行数
        for (let i = 0; i < row; i++) {
            tab = tab + `<tr>`
            // 遍历输入列数
            for (let j = 0; j < col; j++) {
                // 生成单元格
                tab = tab + `<td id="${i + '-' + j}" style="width:141px;height:30px"></td>`
            }
            tab = tab + '</tr>'
        }
        tab = tab + `</table> </div> </div>`
        // 添加html字符串
        $('#app').append(tab)
    }

    /**
     * 节点对象模型
     * @param {number} cellrow 单元格行标
     * @param {number} cellcol 单元格列表
     * @param {number} cellwidth 单元格宽度
     * @param {string} celltype 单元格类型
     * @param {string} cellname 单元格文本内容
     * @param {number} cellrowspan 单元格行合并值
     * @param {number} cellcolspan 单元格列合并值
    */
    function nodeObj(cellrow, cellcol, cellwidth, celltype, cellname, cellrowspan, cellcolspan) {
        this.cellrow = cellrow;
        this.cellcol = cellcol;
        this.cellwidth = cellwidth;
        this.celltype = celltype;
        this.cellname = cellname;
        this.cellrowspan = cellrowspan;
        this.cellcolspan = cellcolspan;
    }

    /**
     * 获取单元格信息 --行 列位置；类型；宽度；内容；行列合并单元格个数
     * @param {number} id 需要获取信息的单元格id
     * @param {Array} list 存放节点对象字符串的数组
     * @param {string} row 单元格行合并的值
     * @param {string} col 单元格列合并的值
    */
    function getCellInfo(id, list, row, col) {
        // 获取单元格
        let cell = $(id)

        // id （行列）需要各自+1；因为前面减一
        let temp = id.split('-')
        // 行
        let rowNum = temp[0].split('#')
        rowNum = rowNum[1].split('#')
        // 单元格行数
        rowNum = (Number(rowNum)) + 1
        // 列
        let colNum = temp[1]
        // 单元格列数
        colNum = (Number(colNum)) + 1

        // 单元格宽度
        /*
            列合并1宽度不变为初始化宽度
            如果有合并：初始化宽度 * 合并数
        */
        let widthNum = cell.css("width").split('p')[0]
        if (Number(col) > 1) {
            widthNum = Number(widthNum * Number(col))
        }
        // 匹配标签类型正则
        let labelReg = /<.+ \s*/
        // 获取子标签类型 如果是<input>转为title
        let str = cell.html().match(labelReg)[0].split(' ')

        // 标签类型
        let label;
        // 因为input标签截取时没有'>'，所以需要判断是否是'<input'如果是 length不用减一
        if (str[0] === '<input') {
            label = str[0].substring(1, str[0].length).trim()
        } else {
            label = str[0].substring(1, str[0].length - 1).trim()
        }

        // 如果子标签类型是 input，那么宽度采用 初始化宽度 * 合并列数量 
        if (label === 'input') {
            widthNum = 140 * Number(col)
        }

        // 判断最后是否 ‘input’ 和 ‘span’ 标签，如果是需要转换称text和title
        label = label === 'h4' ? 'title' : label
        label = label === 'input' ? 'text' : label

        // 如果标签不是 input 就匹配标签文本；是input就获取value值
        let content
        // input标签创建时没有默认值，所以先给一个默认值 后期再修改
        if (label === 'text') {
            content = ' '
        } else {
            // 匹配子标签内容正则
            let ContentReg = />.+</
            let contentStr = cell.html().match(ContentReg)
            // 标签内容
            content = contentStr[0].substring(1, contentStr[0].length - 1).trim()
        }
        // 创建节点对象，并转为json字符串
        let ObjJsonStr = JSON.stringify(
            new nodeObj(rowNum, colNum, widthNum, label, content, Number(row), Number(col))
        )
        // 将字符串添加进数组中
        list.push(ObjJsonStr)
    }
})

/**
 * 更新数组中输入框的值
 * @param {number} id 输入框id
 */
function updateCellName(id) {
    // 根据id获取输入框
    const text = $(id);
    // 分割id 获得注册id的每个部分
    let ids = text.attr('id').split('-')
    // 获取 行 （需要+1）
    let idRow = Number(ids[0]) + 1
    // 获取 列 （需要+1）
    let idCol = Number(ids[1]) + 1
    // 输入框失焦触发，遍历数组，cellrow cellcol和idRow idCol相等时，cellname改为输入框的值
    text.blur(() => {
        for (let i = 0; i < list.length; i++) {
            // 每一项字符串转对象（字符串为json格式，转为匿名对象）
            list[i] = JSON.parse(list[i])
            if (list[i].cellrow === idRow && list[i].cellcol === idCol) {
                list[i].cellname = text.val()
            }
            // 对象重新转为json字符串
            list[i] = JSON.stringify(list[i])
        }
    })
}
