export interface FormData {
  firstName: string,
  lastName: string;
  email: string;
  date: Date;
}


export default function postForm(data: FormData): Promise<string> {
  const fetchWithTimeout = () => {
    return Promise.race<Promise<Response>>([
      fetch('/api/postForm', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 1000);
      })
    ]);
  }

  return fetchWithTimeout()
  // response should be json TODO accept only json
  .then((response) => {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response');
    }
    return response.json();
  }).then((r: any) => {
    return JSON.stringify(r);
  });
}
