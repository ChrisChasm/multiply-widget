import Chart from 'chart.js/auto';
import './widget.css';

// Translations for multilingual support
const translations = {
  en: {
    title: 'The Power of Multiplication',
    startText: 'If I start',
    groupsText: 'Christian groups that each reproduce every',
    monthText: 'month',
    monthsText: 'months',
    howManyText: 'how many total groups will there be at the end of 10 years?',
    yearText: 'Year',
    yearsText: 'Years',
    numberOfGroupsText: 'Number of Groups',
    afterYearsText: 'After 10 years:',
    groupsResultText: 'groups',
    millionText: 'million',
    thousandText: 'thousand'
  },
  es: {
    title: 'El Poder de la Multiplicación',
    startText: 'Si comienzo con',
    groupsText: 'grupos cristianos que se reproducen cada',
    monthText: 'mes',
    monthsText: 'meses',
    howManyText: '¿cuántos grupos habrá en total al final de 10 años?',
    yearText: 'Año',
    yearsText: 'Años',
    numberOfGroupsText: 'Número de Grupos',
    afterYearsText: 'Después de 10 años:',
    groupsResultText: 'grupos',
    millionText: 'millones',
    thousandText: 'mil'
  }
};

export default class MultiplyWidget {
  constructor(options = {}) {
    this.container = document.getElementById(options.container || 'multiplication-widget');
    if (!this.container) {
      console.error('Container element not found');
      return;
    }
    
    this.initialGroups = 1;
    this.monthsToMultiply = 3;
    this.years = 10;
    
    // Add language support - default to English if not specified
    this.language = options.language || 'en';
    if (!translations[this.language]) {
      console.warn(`Language '${this.language}' not supported, falling back to English`);
      this.language = 'en';
    }
    
    this.render();
    this.setupEventListeners();
    this.calculateAndUpdateChart();
  }
  
  // Helper method to get translated text
  t(key) {
    return translations[this.language][key] || translations['en'][key] || key;
  }
  
  render() {
    this.container.classList.add('multiply-widget');
    
    // Title
    const title = document.createElement('h1');
    title.textContent = this.t('title');
    this.container.appendChild(title);
    
    // Interactive message with dropdowns
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('interactive-message');
    
    // Create the interactive message with dropdowns
    messageContainer.innerHTML = `
      ${this.t('startText')} 
      <select id="initial-groups">
        ${Array.from({length: 20}, (_, i) => i + 1).map(num => 
          `<option value="${num}" ${num === this.initialGroups ? 'selected' : ''}>${num}</option>`
        ).join('')}
      </select>
      ${this.t('groupsText')}
      <select id="months-to-multiply">
        ${Array.from({length: 24}, (_, i) => i + 1).map(month => 
          `<option value="${month}" ${month === this.monthsToMultiply ? 'selected' : ''}>${month}</option>`
        ).join('')}
      </select>
      ${this.monthsToMultiply > 1 ? this.t('monthsText') : this.t('monthText')}, ${this.t('howManyText')}
    `;
    
    this.container.appendChild(messageContainer);
    
    // Result display
    const resultDisplay = document.createElement('div');
    resultDisplay.classList.add('result');
    resultDisplay.id = 'result-display';
    this.container.appendChild(resultDisplay);
    
    // Chart container
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    
    const canvas = document.createElement('canvas');
    canvas.id = 'multiplication-chart';
    chartContainer.appendChild(canvas);
    
    this.container.appendChild(chartContainer);
    
    // Initialize the chart
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({length: this.years}, (_, i) => `${this.t('yearText')} ${i + 1}`),
        datasets: [{
          label: this.t('numberOfGroupsText'),
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: this.t('numberOfGroupsText')
            },
            ticks: {
              callback: function(value) {
                if (value >= 1000000) {
                  return (value / 1000000).toFixed(1) + 'M';
                } else if (value >= 1000) {
                  return (value / 1000).toFixed(1) + 'K';
                }
                return value;
              }
            }
          },
          x: {
            title: {
              display: true,
              text: this.t('yearsText')
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                const value = context.parsed.y;
                if (value >= 1000000) {
                  label += (value / 1000000).toFixed(2) + ' ' + this.t('millionText');
                } else if (value >= 1000) {
                  label += (value / 1000).toFixed(2) + ' ' + this.t('thousandText');
                } else {
                  label += value;
                }
                return label;
              }
            }
          },
          datalabels: {
            display: function(context) {
              return true;
            },
            font: {
              weight: 'bold'
            },
            formatter: function(value) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'K';
              }
              return value;
            }
          }
        }
      }
    });
  }
  
  setupEventListeners() {
    const initialGroupsSelect = document.getElementById('initial-groups');
    const monthsToMultiplySelect = document.getElementById('months-to-multiply');
    
    if (initialGroupsSelect && monthsToMultiplySelect) {
      initialGroupsSelect.addEventListener('change', (e) => {
        this.initialGroups = parseInt(e.target.value, 10);
        this.calculateAndUpdateChart();
      });
      
      monthsToMultiplySelect.addEventListener('change', (e) => {
        this.monthsToMultiply = parseInt(e.target.value, 10);
        this.calculateAndUpdateChart();
      });
    }
  }
  
  calculateMultiplication() {
    const results = [];
    let current = this.initialGroups;
    
    // Calculate how many times multiplication happens per year
    const multiplicationsPerYear = 12 / this.monthsToMultiply;
    
    for (let year = 1; year <= this.years; year++) {
      // For each year, multiply the current number by 2^(multiplications per year)
      for (let i = 0; i < multiplicationsPerYear; i++) {
        current *= 2;
      }
      
      // Round to the nearest whole number (no partial groups)
      results.push(Math.round(current));
    }
    
    return results;
  }
  
  calculateAndUpdateChart() {
    const results = this.calculateMultiplication();
    
    // Update chart data
    this.chart.data.datasets[0].data = results;
    this.chart.update();
    
    // Update result display
    const resultDisplay = document.getElementById('result-display');
    if (resultDisplay) {
      const finalResult = results[results.length - 1];
      let formattedResult;
      
      if (finalResult >= 1000000) {
        const millionValue = (finalResult / 1000000).toFixed(2);
        const [intPart, decPart] = millionValue.split('.');
        formattedResult = `${parseInt(intPart).toLocaleString()}.${decPart} ${this.t('millionText')}`;
      } else if (finalResult >= 1000) {
        const thousandValue = (finalResult / 1000).toFixed(2);
        const [intPart, decPart] = thousandValue.split('.');
        formattedResult = `${parseInt(intPart).toLocaleString()}.${decPart} ${this.t('thousandText')}`;
      } else {
        formattedResult = finalResult.toLocaleString();
      }
      
      resultDisplay.textContent = `${this.t('afterYearsText')} ${formattedResult} ${this.t('groupsResultText')}`;
    }
  }
} 