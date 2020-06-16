export const setinfo = info => ({         // token value set action
    type: 'SETINFO',
    info
  })
  
export const clrinfo = () => ({            // token value clear action
    type: 'CLRINFO'
  })