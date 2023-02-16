function Element(cellrow, cellcol, cellwidth, celltype, cellname, cellrowspan, cellcolspan) {
    this.cellrow = cellrow;
    this.cellcol = cellcol;
    this.cellwidth = cellwidth;
    this.celltype = celltype;
    this.cellname = cellname;
    this.cellrowspan = cellrowspan;
    this.cellcolspan = cellcolspan;
}

module.exports = function (cellrow, cellcol, cellwidth, celltype, cellname, cellrowspan, cellcolspan) {
    return new Element(cellrow, cellcol, cellwidth, celltype, cellname, cellrowspan, cellcolspan)
}
