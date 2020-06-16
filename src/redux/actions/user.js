export const setuser = user => ({         // token value set action
    type: 'SETUSER',
    user
  })
  
export const clruser = () => ({            // token value clear action
    type: 'CLRUSER'
  })