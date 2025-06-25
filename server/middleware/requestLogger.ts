import { Request, Response, NextFunction } from 'express';

// Middleware to log request details for debugging
const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log('\n--- Request Details ---');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:');

  // Log each header and its size
  let totalHeaderSize = 0;
  Object.entries(req.headers).forEach(([key, value]) => {
    const valueStr = String(value);
    const size = Buffer.byteLength(key + ': ' + valueStr);
    totalHeaderSize += size;

    // Don't log full auth token for security
    if (key.toLowerCase() === 'authorization' && valueStr.length > 20) {
      const sanitized =
        valueStr.substring(0, 10) + '...' + valueStr.substring(valueStr.length - 10);
      console.log(`  ${key}: ${sanitized} (size: ${size} bytes)`);
    } else {
      console.log(`  ${key}: ${valueStr} (size: ${size} bytes)`);
    }
  });

  console.log(`Total Headers Size: ${totalHeaderSize} bytes`);
  console.log('---------------------\n');

  next();
};

export default requestLogger;
