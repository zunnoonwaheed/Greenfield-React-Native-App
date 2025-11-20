import axiosInstance from './axiosConfig';

/**
 * Get Sectors by Phase
 * GET /get_sectors.php?phase_id={id}
 */
export const getSectorsByPhase = async (phaseId) => {
  try {
    const response = await axiosInstance.get(`/get_sectors.php?phase_id=${phaseId}`);
    console.log('✅ Sectors fetched for phase:', phaseId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching sectors:', error);
    throw error;
  }
};

export default getSectorsByPhase;
