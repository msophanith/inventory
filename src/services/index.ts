import { MovementService } from './movement';
import { ProductService } from './product';
import { telegramService } from './telegram';

const movementService = new MovementService();
const productService = new ProductService();

export { movementService, productService, telegramService };
