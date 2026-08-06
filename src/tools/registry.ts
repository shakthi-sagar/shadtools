import type { ComponentType } from 'react';
import { JsonFormatterTool } from './json/formatter/JsonFormatterTool';
import { Base64EncodeTool } from './base64/encode/Base64EncodeTool';
import { ImageCompressorTool } from './images/compress/ImageCompressorTool';
import { PercentageCalcTool } from './percentage/calculator/PercentageCalcTool';
import { LengthConverterTool } from './units/length/LengthConverterTool';
import { CurrencyConverterTool } from './currency/converter/CurrencyConverterTool';

export const toolRegistry: Record<string, ComponentType<any>> = {
  'json/formatter': JsonFormatterTool,
  'base64/encode': Base64EncodeTool,
  'images/compress': ImageCompressorTool,
  'percentage/calculator': PercentageCalcTool,
  'units/length': LengthConverterTool,
  'currency/converter': CurrencyConverterTool
};

export function getToolComponent(rendererKey: string): ComponentType<any> | null {
  return toolRegistry[rendererKey] || null;
}

export function getRegisteredToolKeys(): string[] {
  return Object.keys(toolRegistry);
}
