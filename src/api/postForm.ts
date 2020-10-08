export interface FormData {
  firstName: string,
  lastName: string;
  email: string;
  date: Date;
}

export default function postForm(data: FormData) {
  // construct json
  let json = '';
  try {
    json = JSON.stringify(data);
  } catch (error) {
    return Promise.reject(error);
  }

  return fetch('/api/postForm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: json,
  })
  // response should be json TODO accept only json
  .then((response) => response.json());
}
