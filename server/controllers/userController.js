import User from '../models/User.js';

export async function getMyProfile(req, res) {
  const user = await User.findById(req.user.id).select('-password -passwordHash -refreshToken');
  res.json({ user });
}

export async function updateProfile(req, res) {
  const allowed = ['name', 'email', 'phone', 'address'];
  const update = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) update[k] = req.body[k];
  });
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password -passwordHash -refreshToken');
  res.json({ user });
}

export async function uploadAvatar(req, res) {
  const fallbackDataUrl = req.file?.buffer
    ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    : null;
  const { url, publicId } = req.body;
  const avatarUrl = url || req.file?.path || fallbackDataUrl;
  if (!avatarUrl) {
    return res.status(400).json({ message: 'Avatar file or URL is required' });
  }
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: { url: avatarUrl, publicId: publicId || req.file?.originalname || null } },
    { new: true }
  ).select('-password -passwordHash -refreshToken');
  res.json({ user });
}

export async function getUserById(req, res) {
  const user = await User.findById(req.params.id).select('-password -passwordHash -refreshToken');
  res.json({ user });
}

export async function getUsers(req, res) {
  const role = req.query.role;
  const query = role ? { role } : {};
  const items = await User.find(query).select('-password -passwordHash -refreshToken');
  res.json({ items });
}
