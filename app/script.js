;(function () {
  window.tooltip1 = function init () {
    // private vars
    var width = 200
    var height = 120
    var padding = {top: 10, bottom: 10, left: 10, right: 10}

    function build (selection) {
      selection.each(function (data, index) {
        // the selected element
        var element = d3.select(this)

        // useful area
        var innerw = width - padding.left - padding.right
        var innerh = height - padding.top - padding.bottom

        var container = element.selectAll('.tooltip1')
            .data([null])

        var eContainer = container.enter()
            .append('g')
            .classed('tooltip1', true)

        container = container.merge(eContainer)

        /*

        Tooltip Proof-Of-Concept

        */

        var dta = [{x: 0, y: 0, d: 0}, {x: width, y: 0, d: 0}, {x: width, y: height, d: 0}, {x: 0, y: height, d: 0}]

        eContainer.selectAll('line')
            .data(dta)
            .enter()
            .append('line')
            .classed('contruct', true)

        var lines = container.selectAll('.contruct')

        eContainer.append('circle')
            .attr('r', 2)
            .classed('mouse', true)
            .style('fill', 'red')

        var mouse = container.select('.mouse')

        var bars = eContainer.append('g').classed('bars', true).style('opacity', 0)

        var bardata = d3.range(8).map(d => ({v: Math.random()}))

        bars.selectAll('rect')
          .data(bardata)
          .enter()
          .append('rect')
          .attr('x', (d, i) => padding.left + i * innerw / bardata.length)
          .attr('width', innerw / bardata.length - 1)
          .attr('height', d => d.v * innerh)
          .attr('y', d => padding.top + innerh - d.v * innerh)

        eContainer.append('g')
            .classed('legend', true)
            .append('rect')
            .attr('width', 60)
            .attr('height', 80)
            .attr('x', -30)
            .attr('y', -40)
            .style('fill', '#eee')
            .style('stroke', '#ccc')

        var legend = container.select('.legend')

        var cols = d3.scaleOrdinal(d3.schemeCategory20b)
        var bx = legend.selectAll('.bx')
          .data(['A', 'B', 'C', 'D'])
          .enter()
          .append('rect')
          .classed('box', true)
          .attr('width', 10)
          .attr('height', 10)
          .attr('x', -25)
          .attr('y', (d, i) => i * 12 - 35)
          .style('fill', (d, i) => cols(i))

        var tx = legend.selectAll('.tx')
          .data(['A', 'B', 'C', 'D'])
          .enter()
          .append('text')
          .text(d => d)
          .attr('x', -11)
          .attr('y', (d, i) => i * 12 - 26)
          .style('font-size', 10)
          .style('font-family', 'sans-serif')

        var chartHidden = true

        element.on('mouseup', function () {
          if (chartHidden) {
            mouse.attr('opacity', 0)
            lines.attr('opacity', 0)
            legend.attr('opacity', 0)
            bars.style('opacity', 1)
            bars.selectAll('rect')
              .on('mouseenter', function () {
                legend.attr('opacity', 1)
                d3.select(this).attr('fill', 'blue')
              })
              .on('mouseleave', function () {
                legend.attr('opacity', 0)
                d3.select(this).attr('fill', 'black')
              })
          } else {
            bars.selectAll('rect').on('mouseenter', null).on('mouseleave', null)
            mouse.attr('opacity', 1)
            lines.attr('opacity', 1)
            legend.attr('opacity', 1)
            bars.style('opacity', 0)
          }
          chartHidden = !chartHidden
        })

        element.on('mousemove', function () {
          var pos = d3.mouse(this)
          // adjust a little bit to be at the mouse center
          pos[0] += 1.5
          pos[1] += 3.5
          mouse.attr('cx', pos[0]).attr('cy', pos[1])

          lines.attr('x1', d => d.x)
            .attr('x2', pos[0])
            .attr('y1', d => d.y)
            .attr('y2', pos[1])
            .each(function (d, i) {
              d.l = this.getTotalLength()
            })

          lines.style('stroke', '#ddd')

          var maxL
          var maxV = 0
          lines.each(function (d, i) {
            if (d.l >= maxV) {
              maxL = this
              maxV = d.l
            }
          })

          d3.select(maxL)
              .style('stroke', 'red')
              .each(function (d, i) {
                var l = this.getTotalLength()
                var p = maxL.getPointAtLength(l - 40)
                legend.attr('transform', `translate(${p.x}, ${p.y})`)
              })
        })
      })
    }

    build.width = function (value) {
      if (!arguments.length) return width
      width = value
      return build
    }

    build.height = function (value) {
      if (!arguments.length) return height
      height = value
      return build
    }

    build.padding = function (options) {
      if (!arguments.length) return build.padding
      return build
    }

    return build
  }
})()
