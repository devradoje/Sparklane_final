export const settoken = token => ({         // token value set action
    type: 'SETTOKEN',
    token
  })
  
export const clrtoken = () => ({            // token value clear action
    type: 'CLRTOKEN'
  })