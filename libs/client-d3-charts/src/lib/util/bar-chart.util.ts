import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

import { IBarChartDataNode, IBarChartOptions, TBarChartData } from '../interfaces/bar-chart.interface';
import { generateConfiguration } from './configuration.util';

/**
 * The bar chart default configuration.
 */
export const defaultBarChartConfig: IBarChartOptions = Object.freeze({
  chartTitle: '',
  width: 600,
  height: 600,
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  transitionDuration: 400,
  xAxisPadding: 0.4,
  xAxisTitle: 'x',
  yAxisTitle: 'y',
  yAxisTicks: 10,
  xAxisLabelShift: {
    x: 10,
    y: 184,
  },
  yAxisLabelShift: {
    x: -10,
    y: -10,
  },
  labelTextWrapWidth: 60, // the number of pixels after which a label needs to be given a new line
  color: d3.scaleOrdinal(d3.schemeCategory10),
});

/**
 * Creates a container for the bar chart.
 * @param container the chart container
 * @param config the chart configuration
 * @returns the object with the svg element and the g element
 */
const createContainer = (container: ElementRef<HTMLDivElement>, config: IBarChartOptions) => {
  const id = container.nativeElement.id ?? 'bar-0';

  d3.select(`#${id}`).select('svg').remove();
  const svg = d3
    .select(`#${id}`)
    .append('svg')
    .attr('width', config.width + config.margin.left + config.margin.right)
    .attr('height', config.height + config.margin.top + config.margin.bottom)
    .attr('class', id);
  const g = svg
    .append('g')
    .attr('transform', `translate(${config.width / 2 - config.margin.left},${config.height / 2 - config.margin.top})`);

  return { svg, g };
};

/**
 * Wraps the bar chart axis labels text.
 * @param svgText the svg text elements
 * @param width the chart axis label width
 */
const wrapSvgText = (svgText: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>, width: number) => {
  svgText.each(function (this: d3.BaseType) {
    const text = d3.select<d3.BaseType, string>(this);
    const words = text.text().split(/\s+/).reverse();
    let line: string[] = [];
    let lineNumber = 0;
    const lineHeight = 1.4;
    const y = text.attr('y');
    const x = text.attr('x');
    const dy = parseFloat(text.attr('dy') ?? 0);
    let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', `${dy}em`); // axis label

    let word = words.pop();

    while (typeof word !== 'undefined') {
      line.push(word ?? '');
      tspan.text(line.join(' '));
      if ((tspan.node()?.getComputedTextLength() ?? 0) > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word ?? ''];
        lineNumber += 1;
        tspan = text
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', `${lineNumber * lineHeight + dy}em`)
          .text(word ?? '');
      }
      word = words.pop();
    }
  });
};

/**
 * Creates the x axis.
 * @param g the svg g element
 * @param x the x axis scale
 * @param config the chart configuration
 */
const createAxisX = (g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>, x: d3.ScaleBand<string>, config: IBarChartOptions) => {
  const xLabels = g.append('g').attr('transform', `translate(0, ${config.height})`).call(d3.axisBottom(x)).append('text');

  g.selectAll('text').call(wrapSvgText, config.labelTextWrapWidth);

  xLabels
    .attr('y', config.height - config.xAxisLabelShift.y)
    .attr('x', config.width + config.xAxisLabelShift.x)
    .attr('text-anchor', 'end')
    .attr('class', 'legend')
    .attr('dy', '0.35em')
    .text(config.xAxisTitle);
};

/**
 * Creates the y axis.
 * @param g the svg g element
 * @param y the y axis scale
 * @param config the chart configuration
 */
const createAxisY = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  y: d3.ScaleLinear<number, number>,
  config: IBarChartOptions,
) => {
  g.append('g')
    .call(
      d3
        .axisLeft(y)
        .tickFormat(function (d) {
          return `${d}`;
        })
        .ticks(config.yAxisTicks),
    )
    .append('text')
    .attr('y', config.yAxisLabelShift.y)
    .attr('x', config.yAxisLabelShift.x)
    .attr('text-anchor', 'end')
    .attr('class', 'legend')
    .text(config.yAxisTitle);
};

/**
 * The mouse over event handler.
 * @param self an svg rect element
 * @param d the chart data node
 * @param g the svg g element
 * @param x the x axis scale
 * @param y the y axis scale
 * @param config the chart configuration
 */
const onMouseOver = (
  self: SVGRectElement,
  d: IBarChartDataNode,
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number>,
  config: IBarChartOptions,
) => {
  const widthModifier = 5;
  d3.select(self)
    .transition()
    .duration(config.transitionDuration)
    .attr('width', x.bandwidth() + widthModifier)
    .attr('y', function () {
      const modifier = 10;
      return y(d.value) - modifier;
    })
    .attr('height', function () {
      const modifier = 10;
      return config.height - y(d.value) + modifier;
    });

  g.append('text')
    .attr('class', 'val')
    .style('font-size', '11px')
    .attr('x', () => x(d.title) ?? '')
    .attr('y', function () {
      const modifier = 15;
      return y(d.value) - modifier;
    })
    .text(() => d.value);
};

/**
 * The mouse out event handler.
 * @param self an svg rect element
 * @param d the chart data node
 * @param x the x axis scale
 * @param y the y axis scale
 * @param config the chart configuration
 */
const onMouseOut = (
  self: SVGRectElement,
  d: IBarChartDataNode,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number>,
  config: IBarChartOptions,
) => {
  d3.select(self).attr('class', 'bar');
  d3.select(self)
    .transition()
    .duration(config.transitionDuration)
    .attr('width', x.bandwidth())
    .attr('y', () => y(d.value) ?? 0)
    .attr('height', () => config.height - (y(d.value) ?? 0));

  d3.selectAll('.val').remove();
};

/**
 * Draws the chart bars, and sets the mouse pointer events.
 * @param g the svg g element
 * @param x the x axis scale
 * @param y the y axis scale
 * @param config the chart configuration
 * @param data the chart data
 */
const drawBarsAndSetPointerEvents = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number>,
  config: IBarChartOptions,
  data: TBarChartData,
) => {
  const duration = 400;
  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .style('fill', (d, i) => config.color(i.toString()))
    .on('mouseover', function (this, event, d) {
      return onMouseOver(this, d, g, x, y, config);
    })
    .on('mouseout', function (this, event, d) {
      return onMouseOut(this, d, x, y, config);
    })
    .attr('x', d => x(d.title) ?? '')
    .attr('y', d => y(d.value))
    .attr('width', x.bandwidth())
    .transition()
    .ease(d3.easeLinear)
    .duration(duration)
    .delay(function (d, i) {
      const multiplier = 50;
      return i * multiplier;
    })
    .attr('height', d => config.height - y(d.value));
};

/**
 * Draws the bar chart.
 * @param container the chart container
 * @param data the chart data
 * @param options the chart options
 * @returns the chart configuration
 */
export const drawBarChart = (container: ElementRef<HTMLDivElement>, data: TBarChartData, options?: Partial<IBarChartOptions>) => {
  const config: IBarChartOptions = generateConfiguration<IBarChartOptions>(defaultBarChartConfig, options, {});

  const { g } = createContainer(container, config);

  const x = d3
    .scaleBand([0, config.width])
    .padding(config.xAxisPadding)
    .domain(data.map(d => d.title));
  const y = d3.scaleLinear([config.height, 0]).domain([0, d3.max(data, d => d.value) ?? 1]);

  createAxisX(g, x, config);

  createAxisY(g, y, config);

  drawBarsAndSetPointerEvents(g, x, y, config, data);

  return config;
};
