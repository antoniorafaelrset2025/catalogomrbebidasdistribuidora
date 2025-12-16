import type { Product, Category } from './types';

export const categories: Category[] = ['Cigarros Sousa Cruz', 'Cigarros Nacional', 'Fumos', 'Seda', 'Isqueiros'];

export const products: Product[] = [
  // Cigarros Sousa Cruz
  { id: 'prod-1', name: 'DUNHILL', description: 'Maço de cigarros Dunhill.', price: 137.80, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-2', name: 'DUNHILL DOUBLE', description: 'Maço de cigarros Dunhill Double.', price: 136.80, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-3', name: 'DUNHILL RED', description: 'Maço de cigarros Dunhill Red.', price: 110.60, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-4', name: 'KENT AZUL', description: 'Maço de cigarros Kent Azul.', price: 112.90, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-5', name: 'KENT PRATA', description: 'Maço de cigarros Kent Prata.', price: 112.90, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-6', name: 'LUCKY STRIKE DOBLE ICE', description: 'Maço de cigarros Lucky Strike Doble Ice.', price: 121.20, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-7', name: 'LUCKY STRIKE VERMELHO', description: 'Maço de cigarros Lucky Strike Vermelho.', price: 73.80, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-8', name: 'MARLBORO RED BOX', description: 'Maço de cigarros Marlboro Red Box.', price: 85.90, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-9', name: 'MARLBORO RED MAÇO', description: 'Maço de cigarros Marlboro Red.', price: 75.90, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-10', name: 'ROTHMANS AZUL', description: 'Maço de cigarros Rothmans Azul.', price: 89.30, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-11', name: 'ROTHMANS PRATA', description: 'Maço de cigarros Rothmans Prata.', price: 89.30, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-12', name: 'ROTHMANS VERMELHO', description: 'Maço de cigarros Rothmans Vermelho.', price: 89.30, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-13', name: 'ROTHMANS GLOBAL AZUL', description: 'Maço de cigarros Rothmans Global Azul.', price: 72.80, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-14', name: 'ROTHMANS GLOBAL VERMELHO', description: 'Maço de cigarros Rothmans Global Vermelho.', price: 72.80, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-15', name: 'ROTHMANS MELANCIA', description: 'Maço de cigarros Rothmans Melancia.', price: 108.30, category: 'Cigarros Sousa Cruz' },
  { id: 'prod-16', name: 'ROTHMANS INTERNACIONAL', description: 'Maço de cigarros Rothmans Internacional.', price: 104.25, category: 'Cigarros Sousa Cruz' },

  // Cigarros Nacional
  { id: 'prod-17', name: 'G BRANCO', description: 'Maço de cigarros G Branco.', price: 28.90, category: 'Cigarros Nacional' },
  { id: 'prod-18', name: 'G VERMELHO', description: 'Maço de cigarros G Vermelho.', price: 28.90, category: 'Cigarros Nacional' },
  { id: 'prod-19', name: 'PANDORA BRANCO', description: 'Maço de cigarros Pandora Branco.', price: 28.90, category: 'Cigarros Nacional' },
  { id: 'prod-20', name: 'PANDORA VERMELHO', description: 'Maço de cigarros Pandora Vermelho.', price: 28.90, category: 'Cigarros Nacional' },
  { id: 'prod-21', name: 'NISE VERMELHO', description: 'Maço de cigarros Nise Vermelho.', price: 28.90, category: 'Cigarros Nacional' },
  { id: 'prod-22', name: 'NISE BRANCO', description: 'Maço de cigarros Nise Branco.', price: 28.90, category: 'Cigarros Nacional' },
  { id: 'prod-23', name: 'K-LINT SILVER', description: 'Maço de cigarros K-Lint Silver.', price: 0, category: 'Cigarros Nacional' }, // Price not provided
  { id: 'prod-24', name: 'GUDANG GARAM (1 CART)', description: 'Cartão de cigarros Gudang Garam.', price: 0, category: 'Cigarros Nacional' }, // Price not provided

  // Fumos
  { id: 'prod-25', name: 'FUMO MELIÁ', description: 'Pacote de fumo Meliá.', price: 63.90, category: 'Fumos' },
  { id: 'prod-26', name: 'FUMO TREVO', description: 'Pacote de fumo Trevo.', price: 81.90, category: 'Fumos' },

  // Seda
  { id: 'prod-27', name: 'SEDA ZOMO CHOCOLATE', description: 'Seda Zomo sabor Chocolate.', price: 29.90, category: 'Seda' },
  { id: 'prod-28', name: 'SEDA ZOMO PINK', description: 'Seda Zomo Pink.', price: 27.90, category: 'Seda' },
  { id: 'prod-29', name: 'SEDA ORGÂNICA', description: 'Seda Orgânica.', price: 25.90, category: 'Seda' },
  { id: 'prod-30', name: 'SEDA BEM BOLADO', description: 'Seda Bem Bolado.', price: 89.90, category: 'Seda' },
  { id: 'prod-31', name: 'PAPEL PARA CIGARRO TREVO CAIXA', description: 'Caixa de papel para cigarro Trevo.', price: 44.70, category: 'Seda' },

  // Isqueiros
  { id: 'prod-32', name: 'BIC', description: 'Isqueiro BIC.', price: 46.50, category: 'Isqueiros' },
  { id: 'prod-33', name: 'CRICKET', description: 'Isqueiro Cricket.', price: 26.90, category: 'Isqueiros' },
  { id: 'prod-34', name: 'GTI', description: 'Isqueiro GTI.', price: 20.70, category: 'Isqueiros' },
];
