const deleteProduct = (btn) => {
  const prodId =  btn.parentNode.querySelector('[name=productID]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  console.log(prodId + "  " + csrf);
};