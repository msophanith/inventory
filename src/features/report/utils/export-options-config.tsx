import { FileSpreadsheet, Download, Zap, PackagePlus, Box } from 'lucide-react';
import type { ExportOptionItem } from '../components/export-option-card';

type TranslateFn = (key: string) => string;

export function getExportOptions(t: TranslateFn): ExportOptionItem[] {
  return [
    {
      id: 'EXCEL',
      title: t('reports.fullSalesMargin'),
      description: t('reports.fullSalesMarginDesc'),
      icon: <FileSpreadsheet size={26} />,
      format: '.xlsx',
      isFeatured: true,
      theme: {
        cardBg: 'bg-gradient-to-br from-emerald-50/90 via-emerald-50/30 to-white',
        border: 'border-emerald-200/80',
        hoverBorder: 'hover:border-emerald-400',
        glow: 'bg-emerald-500/15',
        iconBg: 'bg-emerald-100/90',
        iconColor: 'text-emerald-700 border-emerald-200/70',
        badgeBg: 'bg-white/90 border border-emerald-200',
        badgeText: 'text-emerald-800',
      },
    },
    {
      id: 'PRODUCT_IN_EXCEL',
      title: t('reports.monthlyStockIn'),
      description: t('reports.monthlyStockInDesc'),
      icon: <Download size={22} />,
      format: '.xlsx',
      theme: {
        cardBg: 'bg-gradient-to-br from-blue-50/90 via-sky-50/30 to-white',
        border: 'border-blue-200/80',
        hoverBorder: 'hover:border-blue-400',
        glow: 'bg-blue-500/15',
        iconBg: 'bg-blue-100/90',
        iconColor: 'text-blue-700 border-blue-200/70',
        badgeBg: 'bg-white/90 border border-blue-200',
        badgeText: 'text-blue-800',
      },
    },
    {
      id: 'NEW_PRODUCT_EXCEL',
      title: t('reports.newProductsAdded'),
      description: t('reports.newProductsAddedDesc'),
      icon: <PackagePlus size={22} />,
      format: '.xlsx',
      theme: {
        cardBg: 'bg-gradient-to-br from-purple-50/90 via-violet-50/30 to-white',
        border: 'border-purple-200/80',
        hoverBorder: 'hover:border-purple-400',
        glow: 'bg-purple-500/15',
        iconBg: 'bg-purple-100/90',
        iconColor: 'text-purple-700 border-purple-200/70',
        badgeBg: 'bg-white/90 border border-purple-200',
        badgeText: 'text-purple-800',
      },
    },
    {
      id: 'MONTH_CSV',
      title: t('reports.monthlySummary'),
      description: t('reports.monthlySummaryDesc'),
      icon: <Box size={22} />,
      format: '.csv',
      theme: {
        cardBg: 'bg-gradient-to-br from-slate-50/90 via-indigo-50/20 to-white',
        border: 'border-slate-200/80',
        hoverBorder: 'hover:border-slate-400',
        glow: 'bg-indigo-500/10',
        iconBg: 'bg-slate-100/90',
        iconColor: 'text-slate-700 border-slate-200/70',
        badgeBg: 'bg-white/90 border border-slate-200',
        badgeText: 'text-slate-700',
      },
    },
    {
      id: 'TODAY_CSV',
      title: t('reports.todaysSales'),
      description: t('reports.todaysSalesDesc'),
      icon: <Zap size={22} className='fill-amber-500/20' />,
      format: '.csv',
      theme: {
        cardBg: 'bg-gradient-to-br from-amber-50/90 via-orange-50/30 to-white',
        border: 'border-amber-200/80',
        hoverBorder: 'hover:border-amber-400',
        glow: 'bg-amber-500/15',
        iconBg: 'bg-amber-100/90',
        iconColor: 'text-amber-700 border-amber-200/70',
        badgeBg: 'bg-white/90 border border-amber-200',
        badgeText: 'text-amber-800',
      },
    },
  ];
}
