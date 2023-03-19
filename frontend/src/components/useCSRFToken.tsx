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

const csrftoken = getCookie('csrftoken') || '';

const CSRFToken = () => {
  return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />;
};
export default CSRFToken;
