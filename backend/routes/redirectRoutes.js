import express from 'express';
import { trackClick } from '../services/linkService.js';

const router = express.Router();

// GET /r/:code
// Example: http://localhost:3001/api/r/AbC12345
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    // We no longer need to pass IP/UserAgent/Referrer
    const targetUrl = await trackClick(code);

    if (targetUrl) {
      // 302 Temporary Redirect ensures the browser requests the server every time
      // (crucial for accurate click counting)
      return res.redirect(302, targetUrl); 
    } else {
      return res.status(404).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>Link Not Found</h1>
            <p>The link you are trying to access does not exist or has expired.</p>
        </div>
      `);
    }
  } catch (err) {
    console.error("Redirect Fatal Error:", err);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;