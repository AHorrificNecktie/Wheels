// pages/api/protected.ts
import { withAuth } from '../../../utils/auth';

const handler = withAuth((req, res) => {
  res.status(200).json({ data: 'Protected data' });
});

export default handler;
