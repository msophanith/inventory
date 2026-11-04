import { MovementService } from './movement';
import { ProductService } from './product';
import { telegramService, TelegramService, type TelegramTestResult } from './telegram';
import { activityLogService, ActivityLogService } from './activity-log';

const movementService = new MovementService();
const productService = new ProductService();

export {
  movementService,
  productService,
  telegramService,
  TelegramService,
  type TelegramTestResult,
  activityLogService,
  ActivityLogService,
};
export * from './product.types';
export * from './movement.types';
export * from './activity-log.types';
