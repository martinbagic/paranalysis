
class Aid {
    constructor(conf, d3) {
        this.conf = conf;
        this.d3 = d3;
        this.colorScale = this.d3.scaleSequential().domain([1, this.conf.nPoints])
            .interpolator(this.d3.interpolateReds); // interpolateTurbo, interpolateBlues
    }
    normPDF(x, m, s) {
        return Math.pow(Math.E, -Math.pow((x - m) / s, 2) / 2) / s / Math.sqrt(2 * Math.PI);
    }
    normSeq(m, s) {
        let range = [...Array(this.conf.nPoints).keys()]
        let seq = range.map(x => aid.normPDF(x, m, s))
        return seq
    }
    normalizeOne(array) {
        let min = Math.min(...array);
        let max = Math.max(...array);
        return array.map(element => (element - min) / (max - min))
    }
    normalize(array) {
        // console.log(array)
        // let min = Math.min(...array)
        // let max = Math.max(...array)
        // return array.map(e => (e - min) / (max - min))
        let min = Math.min(...array.map(subarray => Math.min(...subarray)))
        let max = Math.max(...array.map(subarray => Math.max(...subarray)))
        array = array.map(subarray => subarray.map(e => (e - min) / (max - min)))
        array = array.map(subarray => subarray.map((e,i) => e / subarray[e][i] * 0.5))
        return array
    }
    clip(x, min, max) {
        if (x > max) {
            return max
        } else if (x < min) {
            return min
        } else {
            return x
        }
    }
    handleToDist(x, y) {
        let mean = x / this.conf.svgWidth * this.conf.nPoints;
        let std = y / this.conf.svgHeight * this.conf.maxStd + 0.1;
        return [mean, std];
    }
    transpose(a) {
        return Array.from(a[0]).map((_, i) => a.map(row => row[i]));
    }



}

