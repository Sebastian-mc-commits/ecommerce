//chatgpt messages :)

const productMessages = {
  DELETED_PRODUCT: (title) =>
    `${title} Has been deleted. If you want to restore the product go to your account and deleted products`,
  UPDATED_PRODUCT: (title) =>
    `Product ${title} update successful! Enjoy the new features and enhancements.`,
  ADDED_PRODUCT: (title) => `New Product ${title} Released!`,

  DUPLICATE_ENTRY: `We regret to inform you that an error has occurred while processing your request. 
    The product code you entered is already associated with another product in our system, and as a result, 
    we are unable to create a new product with the same code. 
    To resolve this issue, please choose a different product 
    code or contact our support team for further assistance. 
    We apologize for any inconvenience this may have caused.`,

  PRODUCT_PERMANENTLY_DELETED: (
    title
  ) => `We wanted to inform you that the product you requested to be deleted, 
    ${title}, has now been permanently removed from our system. This means that the product and its
     associated data have been completely erased and cannot be recovered.`,

  PRODUCT_RESTORED: (
    title
  ) => `We're writing to let you know that the product, ${title}, has been restored to our 
    system. All associated data for the product has also been restored and is now available again in your account.
    Please note that the product has been restored to the same state it was in before it was deleted.
     If you have any concerns or questions about this process, please don't hesitate to reach out to our support team.`,

  FIELD_ERROR: `Please check the following product fields to make sure they meet the requirements:

     - Stock: The stock field must be higher than 0.
     - Code: The code field must be unique.
     - Image URL: The image URL must be valid and match the product.
     
     Please make any necessary changes and try again. Thank you.
     `,

    NOT_FOUND: `We're sorry, but we could not find a product with 
    the data you provided. Please check it and try again or contact 
    customer support if you need further assistance.`
};

export default productMessages;
