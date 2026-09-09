import {
  AlertTriangle,
  DollarSign,
  Package,
  Percent,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import type { MonthlyReportSummary } from '../types/report.types';
import { useLanguage } from '../../../i18n/language-context';
import { ReportSummaryCardItem } from './report-summary-card-item';

interface Props {
  readonly summary: MonthlyReportSummary;
  readonly monthLabel: string;
}

export function ReportSummary({ summary, monthLabel }: Props) {
  const { t } = useLanguage();
  const isMarginPositive = summary.netMargin >= 0;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {/* 1. Total Sales */}
      <ReportSummaryCardItem
        title={`${t('reports.totalSales')} (${monthLabel})`}
        usdAmount={summary.totalSales}
        khrAmount={summary.totalSales}
        theme='emerald'
        icon={DollarSign}
        footerLeft={
          <span className='flex items-center gap-1.5'>
            <ShoppingBag size={13} />
            {t('pos.itemsCount', { count: summary.totalItemsSold })}
          </span>
        }
        footerRight={
          <span className='rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200/60'>
            {summary.orderCount} {t('reports.totalOrders')}
          </span>
        }
      />

      {/* 2. Total Cost of Goods */}
      <ReportSummaryCardItem
        title={t('reports.costOfGoods')}
        usdAmount={summary.totalCost}
        khrAmount={summary.totalCost}
        theme='indigo'
        icon={Package}
        footerLeft={<span>COGS Inventory Cost</span>}
        footerRight={
          <span className='rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200/60'>
            {summary.totalItemsSold} units
          </span>
        }
      />

      {/* 3. Net Profit Margin */}
      <ReportSummaryCardItem
        title={t('reports.netProfit')}
        usdAmount={summary.netMargin}
        khrAmount={summary.netMargin}
        theme={isMarginPositive ? 'emerald' : 'rose'}
        icon={TrendingUp}
        footerLeft={<span>{t('reports.margin')}</span>}
        footerRight={
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold border ${
              isMarginPositive
                ? 'bg-emerald-100/90 text-emerald-800 border-emerald-200/80'
                : 'bg-rose-100/90 text-rose-800 border-rose-200/80'
            }`}
          >
            <Percent size={11} />
            {summary.marginPercentage.toFixed(1)}%
          </span>
        }
      />

      {/* 4. Returns & Damage Losses */}
      <ReportSummaryCardItem
        title={`${t('movement.return')} & ${t('movement.damaged')}`}
        usdAmount={summary.totalLosses}
        khrAmount={summary.totalLosses}
        theme='rose'
        icon={AlertTriangle}
        footerLeft={
          <span>
            {summary.totalItemsReturned} {t('movement.return')}
          </span>
        }
        footerRight={
          <span className='rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200/60'>
            {summary.totalItemsDamaged} {t('movement.damaged')}
          </span>
        }
      />
    </div>
  );
}
