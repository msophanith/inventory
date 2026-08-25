import { Helmet } from 'react-helmet-async';

const APP_NAME = 'Inventory';

interface PageMetaProps {
  title: string;
  description?: string;
}

/**
 * PageMeta — global SEO head manager.
 * Renders `<title>` and `<meta name="description">` via react-helmet-async.
 *
 * Usage:
 *   <PageMeta title="Dashboard" description="Overview of KPIs..." />
 *   → produces: <title>Dashboard | Inventory</title>
 */
const PageMeta = ({ title, description }: PageMetaProps) => (
  <Helmet>
    <title>{`${title} | ${APP_NAME}`}</title>
    {description && <meta name='description' content={description} />}
  </Helmet>
);

export { PageMeta };
