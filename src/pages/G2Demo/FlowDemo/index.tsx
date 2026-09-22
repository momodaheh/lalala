import { PageContainer } from '@ant-design/pro-components';
import { Graph } from '@antv/g6';
import { useEffect } from 'react';

const data = {
  nodes: [
    { id: '0', label: '开始' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4', label: '网络校验,调试,现场调试' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
  ],
  edges: [
    { source: '0', target: '1', state: 'finished' },
    { source: '1', target: '2', state: 'finished' },
    { source: '2', target: '3', state: 'unfinished' },
    { source: '2', target: '4', state: 'current' },
    { source: '3', target: '5', state: 'unfinished' },
    { source: '4', target: '5', state: 'unfinished' },
    { source: '5', target: '6', state: 'unfinished' },
    { source: '6', target: '7', state: 'unfinished' },
    { source: '7', target: '8', state: 'unfinished' },
    { source: '8', target: '9', state: 'unfinished' },
  ],
};

const _getTextWidth = (text, fontSize = 14) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${fontSize}px sans-serif`;
  return ctx.measureText(text).width;
};
const FlowDemo = () => {
  useEffect(() => {
    const graph = new Graph({
      container: 'flow-container',
      autoFit: {
        type: 'view',
        options: {
          when: 'overflow',
          direction: 'both',
        },
      },
      autoResize: true,
      background: '#fff',
      data: data,
      layout: {
        type: 'antv-dagre',
        rankdir: 'LR',
        controlPoints: true,
      },
      node: {
        type: 'rect',
        style: {
          fill: '#f1f1f1',
          stroke: (node) => {
            const edges = data.edges.filter((edge) => edge.target === node.id);
            if (edges.some((edge) => edge.state === 'current'))
              return '#2279f3';
            if (edges.some((edge) => edge.state === 'finished'))
              return '#3b8f12';
            else return '#9c9696';
          },
          lineWidth: 2,
          radius: 6,
          labelText: (node) => {
            return node.label;
          },
          labelPlacement: 'center',
          autoFitLabel: true,
          state: (node) => {
            if (
              data.edges
                .filter((eage) => eage.target === node.id)
                .some((edge) => edge.state === 'current')
            )
              return 'selected';
            return 'default';
          },
        },
      },
      edge: {
        type: 'polyline',
        style: {
          stroke: (edge) => {
            switch (edge.state) {
              case 'finished':
                return '#52c41a';
              case 'current':
                return '#3728fe';
              case 'unfinished':
                return '#4a4848';
              default:
                return '#52c41a';
            }
          },
        },
      },
    });
    graph.render();
    return () => {
      graph.destroy();
    };
  }, []);

  return (
    <PageContainer>
      <div id="flow-container" />
    </PageContainer>
  );
};

export default FlowDemo;
