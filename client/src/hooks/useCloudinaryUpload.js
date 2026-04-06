import { useDispatch, useSelector } from 'react-redux';
import { uploadToCloudinary, uploadPrescription, uploadAvatar, resetUpload } from '../store/uploadSlice.js';

export function useCloudinaryUpload() {
  const dispatch = useDispatch();
  const { status, error, lastUpload } = useSelector((s) => s.upload);

  const uploadFile = async (file) => {
    const res = await dispatch(uploadToCloudinary(file));
    return res.payload;
  };

  const savePrescription = async (payload) => {
    return dispatch(uploadPrescription(payload));
  };

  const saveAvatar = async (payload) => {
    return dispatch(uploadAvatar(payload));
  };

  const reset = () => dispatch(resetUpload());

  return { status, error, lastUpload, uploadFile, savePrescription, saveAvatar, reset };
}
