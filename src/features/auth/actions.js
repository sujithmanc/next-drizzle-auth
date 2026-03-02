'use server'

export async function signUpAction(formData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    password: formData.get('password'),
  }

  

  console.log('[SignUp]', data)
}

export async function loginAction(formData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  console.log('[Login]', data)
}
