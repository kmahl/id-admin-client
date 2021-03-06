import React from 'react';
import { Select } from 'antd';

const colors = [
  { name: 'gray', value:	'#808080'},
  { name: 'bright_pink', value: '#FF007F' },
  { name: 'red', value: '#FF0000' },
  { name: 'orange', value: '#FF7F00' },
  { name: 'yellow', value: '#FFFF00' },
  { name: 'chartreuse', value: '#7FFF00' },
  { name: 'green', value: '#00FF00' },
  { name: 'spring_green', value: '#00FF7F' },
  { name: 'OLIVE', value:	'#808000'},
  { name: 'cyan', value: '#00FFFF' },
  { name: 'teal', value:	'#008080'},
  { name: 'azure', value: '#007FFF' },
  { name: 'blue', value: '#0000FF' },
  { name: 'navy', value:	'#000080'},
  { name: 'violet', value: '#7F00FF' },
  { name: 'magenta', value: '#FF00FF' },
  { name: 'purple', value:	'#800080'},
  { name: 'marron', value:	'#800000'},
];

const ColorRow = ({ color }) =>
  (<div className="color-option">
    <div className="color-row" style={{ backgroundColor: color.value }}></div > {color.name}
  </div>);


export {
  ColorRow,
  colors,
};