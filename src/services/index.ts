import { MovementService } from './movement';
import { ProductService } from './product';
import { telegramService } from './telegram';
import { activityLogService, ActivityLogService } from './activity-log';

const movementService = new MovementService();
const productService = new ProductService();

export {
  movementService,
  productService,
  telegramService,
  activityLogService,
  ActivityLogService,
};
export * from './product.types';
export * from './movement.types';
export * from './activity-log.types';
