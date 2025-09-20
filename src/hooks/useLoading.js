import { useLoading } from '../contexts/LoadingContext';

export function useLoadingActions() {
  const { showLoading, hideLoading } = useLoading();

  const withLoading = async (asyncFunction, message = 'Carregando...') => {
    try {
      showLoading(message);
      const result = await asyncFunction();
      return result;
    } finally {
      hideLoading();
    }
  };

  const simulateLoading = (duration = 2000, message = 'Carregando...') => {
    showLoading(message);
    setTimeout(() => {
      hideLoading();
    }, duration);
  };

  return {
    showLoading,
    hideLoading,
    withLoading,
    simulateLoading
  };
}

export { useLoading };
