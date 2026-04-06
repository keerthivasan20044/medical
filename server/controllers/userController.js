import User from '../models/User.js';

export async function getMyProfile(req, res) {
  const user = await User.findById(req.user.id).select('-passwordHash -refreshToken');
  res.json({ user });
}

export async function updateProfile(req, res) {
  const allowed = ['name', 'email', 'phone', 'address'];
  const update = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) update[k] = req.body[k];
  });
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-passwordHash -refreshToken');
  res.json({ user });
}

export async function uploadAvatar(req, res) {
  const { url, publicId } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { avatar: { url, publicId } }, { new: true }).select('-passwordHash -refreshToken');
  res.json({ user });
}

export async function getUserById(req, res) {
  const user = await User.findById(req.params.id).select('-passwordHash -refreshToken');
  res.json({ user });
}

export async function getUsers(req, res) {
  const role = req.query.role;
  const query = role ? { role } : {};
  const items = await User.find(query).select('-passwordHash -refreshToken');
  res.json({ items });
}
