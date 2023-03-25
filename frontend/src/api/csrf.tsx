function getCookie(name: string): string | null {
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    // eslint-disable-next-line no-restricted-syntax
    for (const element of cookies) {
      const cookie = element.trim();
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
  }
  return null;
}

export const getCSRFValue = () => getCookie('csrftoken') || '';

const InputCSRF = () => {
  const token = getCSRFValue();
  return <input type="hidden" name="csrfmiddlewaretoken" value={token} />;
};

export default InputCSRF;
