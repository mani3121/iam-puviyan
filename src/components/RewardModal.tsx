import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createReward, uploadImage } from '../services/firebaseService'

interface RewardModalProps {
  open: boolean
  onClose: () => void
  onSave: (rewardData: any) => void
  onPublishSuccess?: () => void
  editingReward?: any
}

const RewardModal = ({ open, onClose, onSave, onPublishSuccess, editingReward }: RewardModalProps) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    brandName: '',
    availableCoupons: '',
    fullImage: '',
    previewImage: '',
    rewardSubtitle: '',
    rewardTitle: '',
    usefulnessScore: '',
    rewardDetails: '',
    howToClaim: '',
    termsAndConditions: '',
    approverEmails: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [posterImageFile, setPosterImageFile] = useState<File | null>(null)
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null)
  const [fullImageUploading, setFullImageUploading] = useState(false)
  const [previewImageUploading, setPreviewImageUploading] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  // Populate form when editingReward is provided
  useEffect(() => {
    if (editingReward) {
      setFormData({
        brandName: editingReward.brandName || '',
        availableCoupons: editingReward.availableCoupons || '',
        fullImage: editingReward.fullImage || '',
        previewImage: editingReward.previewImage || '',
        rewardSubtitle: editingReward.rewardSubtitle || '',
        rewardTitle: editingReward.rewardTitle || '',
        usefulnessScore: editingReward.usefulnessScore?.toString() || '',
        rewardDetails: editingReward.rewardDetails?.[0] || '',
        howToClaim: editingReward.howToClaim?.[0] || '',
        termsAndConditions: editingReward.termsAndConditions?.[0] || '',
        approverEmails: editingReward.approverEmails || []
      })
    } else {
      // Reset form for new reward
      setFormData({
        brandName: '',
        availableCoupons: '',
        fullImage: '',
        previewImage: '',
        rewardSubtitle: '',
        rewardTitle: '',
        usefulnessScore: '',
        rewardDetails: '',
        howToClaim: '',
        termsAndConditions: '',
        approverEmails: []
      })
    }
  }, [editingReward])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const addApproverEmail = () => {
    if (emailInput && emailInput.includes('@') && formData.approverEmails.length < 10) {
      setFormData(prev => ({
        ...prev,
        approverEmails: [...prev.approverEmails, emailInput.trim()]
      }))
      setEmailInput('')
      setFieldErrors(prev => ({ ...prev, general: '' }))
    } else if (!emailInput.includes('@')) {
      setFieldErrors(prev => ({ ...prev, general: 'Please enter a valid email address' }))
    } else if (formData.approverEmails.length >= 10) {
      setFieldErrors(prev => ({ ...prev, general: 'Maximum 10 approver emails allowed' }))
    }
  }

  const removeApproverEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      approverEmails: prev.approverEmails.filter((_, i) => i !== index)
    }))
  }

  const handlePublishReward = async () => {
    await handleSubmitWithStatus('active')
  }

  const handleSaveDraft = async () => {
    await handleSubmitWithStatus('draft')
  }

  const handleSubmitWithStatus = async (status: string) => {
    setLoading(true)
    setFieldErrors({})
    
    try {
      // Validate required fields
      const errors: Record<string, string> = {}
      
      if (!formData.brandName.trim()) {
        errors.brandName = 'Brand name is required'
      }
      
      if (!formData.rewardTitle.trim()) {
        errors.rewardTitle = 'Reward title is required'
      }
      
      if (!formData.availableCoupons.trim()) {
        errors.availableCoupons = 'Available coupons is required'
      }
      
      // Images are already uploaded, just use the URLs from formData
      const fullImageUrl = formData.fullImage
      const previewImageUrl = formData.previewImage
      
      // Validate that at least one image is uploaded
      if (!fullImageUrl && !previewImageUrl) {
        throw new Error('Please upload at least one image')
      }
      
      // If there are field errors, set them and stop
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        return
      }
      
      // Prepare reward data
      const rewardData = {
        brandName: formData.brandName,
        availableCoupons: formData.availableCoupons,
        fullImage: fullImageUrl,
        fullImageGreyed: fullImageUrl,
        previewImage: previewImageUrl || fullImageUrl, // Fallback to fullImage if no preview
        previewImageGreyed: previewImageUrl || fullImageUrl, // Fallback to fullImage if no preview
        rewardSubtitle: formData.rewardSubtitle,
        rewardTitle: formData.rewardTitle,
        usefulnessScore: parseFloat(formData.usefulnessScore) || 0,
        rewardDetails: formData.rewardDetails ? [formData.rewardDetails] : [],
        howToClaim: formData.howToClaim ? [formData.howToClaim] : [],
        termsAndConditions: formData.termsAndConditions ? [formData.termsAndConditions] : [],
        approverEmails: formData.approverEmails,
        likeCount: 0,
        dislikeCount: 0,
        deductPoints: 0,
        maxPerUser: 1,
        rewardType: 'general',
        status: status, // Set status based on button clicked
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      // Save to Firebase
      const result = await createReward(rewardData)
      
      if (result.success) {
        onSave(rewardData)
        
        // If publishing successfully, show toast and redirect
        if (status === 'active') {
          // Show success toast
          setShowSuccessToast(true)
          
          // Call success callback if provided
          if (onPublishSuccess) {
            onPublishSuccess()
          }
          
          // Close modal immediately
          onClose()
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard')
          }, 1500)
        } else {
          // For draft, just close modal normally
          onClose()
        }
        
        // Reset form
        setFormData({
          brandName: '',
          availableCoupons: '',
          fullImage: '',
          previewImage: '',
          rewardSubtitle: '',
          rewardTitle: '',
          usefulnessScore: '',
          rewardDetails: '',
          howToClaim: '',
          termsAndConditions: '',
          approverEmails: []
        })
        setPosterImageFile(null)
        setPreviewImageFile(null)
      } else {
        throw new Error(result.message)
      }
    } catch (err: any) {
      setFieldErrors(prev => ({ ...prev, general: err.message || 'Failed to create reward' }))
    } finally {
      setLoading(false)
    }
  }

  const handlePosterUpload = async (file: File) => {
    setPosterImageFile(file)
    setFullImageUploading(true)
    
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG and PNG files are allowed for full image')
      }
      
      // Validate aspect ratio (16:9)
      const aspectRatio = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve({ width: img.width, height: img.height })
        img.onerror = reject
        img.src = URL.createObjectURL(file)
      })
      
      const ratio = aspectRatio.width / aspectRatio.height
      if (Math.abs(ratio - 16/9) > 0.01) { // Allow small tolerance
        throw new Error('Full image must have 16:9 aspect ratio')
      }
      
      // Upload to storage immediately
      const uploadResult = await uploadImage(file, 'rewards')
      if (uploadResult.success && uploadResult.url) {
        setFormData(prev => ({ ...prev, fullImage: uploadResult.url! }))
      } else {
        throw new Error(uploadResult.message)
      }
    } catch (err: any) {
      setFieldErrors(prev => ({ ...prev, fullImage: err.message || 'Failed to upload full image' }))
      // Reset file on error
      setPosterImageFile(null)
      setFormData(prev => ({ ...prev, fullImage: '' }))
    } finally {
      setFullImageUploading(false)
    }
  }

  const handlePreviewImageUpload = async (file: File) => {
    setPreviewImageFile(file)
    setPreviewImageUploading(true)
    
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG and PNG files are allowed for preview image')
      }
      
      // Upload to storage immediately
      const uploadResult = await uploadImage(file, 'rewards')
      if (uploadResult.success && uploadResult.url) {
        setFormData(prev => ({ ...prev, previewImage: uploadResult.url! }))
      } else {
        throw new Error(uploadResult.message)
      }
    } catch (err: any) {
      setFieldErrors(prev => ({ ...prev, previewImage: err.message || 'Failed to upload preview image' }))
      // Reset file on error
      setPreviewImageFile(null)
      setFormData(prev => ({ ...prev, previewImage: '' }))
    } finally {
      setPreviewImageUploading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <>
        <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 800,
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'auto'
      }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" p={3} borderBottom={1} borderColor="divider">
          <Typography variant="h5" fontWeight="bold">
            {editingReward ? 'Edit Reward' : 'Create New Reward'}
          </Typography>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Stack>

        {/* Form Content */}
        <Box sx={{ p: 3 }}>
          {/* General Error Display */}
          {fieldErrors.general && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {fieldErrors.general}
            </Alert>
          )}
          
          {/* Basic Information */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Basic Information
          </Typography>

          {/* ✅ FIXED: size={{}} + NO item prop */}
          <Grid container spacing={3} mb={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Brand Name"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                error={!!fieldErrors.brandName}
                helperText={fieldErrors.brandName}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Reward Title"
                value={formData.rewardTitle}
                onChange={(e) => handleInputChange('rewardTitle', e.target.value)}
                error={!!fieldErrors.rewardTitle}
                helperText={fieldErrors.rewardTitle}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Reward Subtitle"
                value={formData.rewardSubtitle}
                onChange={(e) => handleInputChange('rewardSubtitle', e.target.value)}
                error={!!fieldErrors.rewardSubtitle}
                helperText={fieldErrors.rewardSubtitle}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Available coupons to redeem"
                value={formData.availableCoupons}
                onChange={(e) => handleInputChange('availableCoupons', e.target.value)}
                error={!!fieldErrors.availableCoupons}
                helperText={fieldErrors.availableCoupons}
              />
            </Grid>
          </Grid>

          {/* Upload Images */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Upload Images
          </Typography>

          <Grid container spacing={3} mb={3}>
            {/* Full Image Upload */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Full Image
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  cursor: fullImageUploading ? 'not-allowed' : 'pointer',
                  '&:hover': { borderColor: fullImageUploading ? '#ccc' : '#4CAF50', backgroundColor: fullImageUploading ? 'transparent' : 'rgba(76, 175, 80, 0.04)' },
                  transition: 'all 0.2s ease',
                  opacity: fullImageUploading ? 0.7 : 1
                }}
                onClick={() => !fullImageUploading && document.getElementById('full-image-input')?.click()}
              >
                <input
                  id="full-image-input"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePosterUpload(file);
                  }}
                />
                <Upload size={40} color="#666" />
                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                  {fullImageUploading ? 'Uploading...' : (posterImageFile ? posterImageFile.name : 'Click to upload full image')}
                </Typography>
                {fullImageUploading && (
                  <Box sx={{ mt: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
                {formData.fullImage && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={formData.fullImage}
                      alt="Full Image"
                      style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
                    />
                  </Box>
                )}
              </Box>
              {fieldErrors.fullImage && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {fieldErrors.fullImage}
                </Alert>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                JPG/PNG, 16:9 aspect ratio recommended
              </Typography>
            </Grid>

            {/* Preview Image Upload */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Preview Image
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  cursor: previewImageUploading ? 'not-allowed' : 'pointer',
                  '&:hover': { borderColor: previewImageUploading ? '#ccc' : '#4CAF50', backgroundColor: previewImageUploading ? 'transparent' : 'rgba(76, 175, 80, 0.04)' },
                  transition: 'all 0.2s ease',
                  opacity: previewImageUploading ? 0.7 : 1
                }}
                onClick={() => !previewImageUploading && document.getElementById('preview-image-input')?.click()}
              >
                <input
                  id="preview-image-input"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePreviewImageUpload(file);
                  }}
                />
                <Upload size={40} color="#666" />
                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                  {previewImageUploading ? 'Uploading...' : (previewImageFile ? previewImageFile.name : 'Click to upload preview image')}
                </Typography>
                {previewImageUploading && (
                  <Box sx={{ mt: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
                {formData.previewImage && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={formData.previewImage}
                      alt="Preview Image"
                      style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
                    />
                  </Box>
                )}
              </Box>
              {fieldErrors.previewImage && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {fieldErrors.previewImage}
                </Alert>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                JPG/PNG, smaller version for preview
              </Typography>
            </Grid>
          </Grid>

          {/* Reward Details */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Details
          </Typography>

          <Box mb={3}>
            <TextField
              fullWidth
              label="Details"
              value={formData.rewardDetails}
              onChange={(e) => handleInputChange('rewardDetails', e.target.value)}
              multiline
              rows={4}
              placeholder="Enter detailed information about the reward..."
            />
          </Box>

          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            How to Claim
          </Typography>

          <Box mb={3}>
            <TextField
              fullWidth
              label="How to Claim"
              value={formData.howToClaim}
              onChange={(e) => handleInputChange('howToClaim', e.target.value)}
              multiline
              rows={4}
              placeholder="Enter step-by-step instructions on how to claim this reward..."
            />
          </Box>

          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Terms and Conditions
          </Typography>

          <Box mb={3}>
            <TextField
              fullWidth
              label="Terms and Conditions"
              value={formData.termsAndConditions}
              onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
              multiline
              rows={4}
              placeholder="Enter terms and conditions for this reward..."
            />
          </Box>

          {/* Approver Emails */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Approver Emails
          </Typography>

          <Box mb={3}>
            <Stack direction="row" spacing={2} mb={2}>
              <TextField
                fullWidth
                label="Enter email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addApproverEmail()
                  }
                }}
                placeholder="Type email and press Enter"
              />
              <Button 
                onClick={addApproverEmail}
                variant="outlined"
                disabled={!emailInput || !emailInput.includes('@')}
              >
                Add
              </Button>
            </Stack>
            
            {/* Email Chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {formData.approverEmails.map((email, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    gap: 1
                  }}
                >
                  {email}
                  <IconButton
                    size="small"
                    onClick={() => removeApproverEmail(index)}
                    sx={{ color: 'inherit', padding: 0.5 }}
                  >
                    <X size={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>
            
            {formData.approverEmails.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No approver emails added. Add 1-10 email addresses.
              </Typography>
            )}
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {formData.approverEmails.length}/10 emails added
            </Typography>
          </Box>
        </Box>

        
        {/* Footer Actions */}
        <Divider />
        <Stack direction="row" spacing={2} justifyContent="flex-end" p={3}>
          <Button onClick={onClose} variant="text" disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDraft} 
            variant="outlined" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button 
            onClick={handlePublishReward} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Reward'}
          </Button>
        </Stack>
      </Box>
      
      {/* Success Toast */}
      <Snackbar
        open={showSuccessToast}
        autoHideDuration={3000}
        onClose={() => setShowSuccessToast(false)}
        message="Reward published successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbar-content': {
            backgroundColor: 'success.main',
            color: 'success.contrastText'
          }
        }}
      />
    </>
    </Modal>
  )
}

export default RewardModal
