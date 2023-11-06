/*
 * To use Sizey recommendation, you can use this script to make process simler.
 * This script is not dependant to any e-commerce platform. Only requirement is that this script
 * is loaded somewhere in e-shop and HTML -element is created having id sizey-container.
 *
 * This script will automatically add all the needed elements inside that container.
 * This can be achieved in WooCommerce with following code.
 *
 * add_action( 'wp_enqueue_scripts', 'sizey_scripts' );
 * function sizey_scripts() {
 *   	wp_enqueue_script('sizeyjs', 'http://<your-shop.com>/wp-content/themes/twentytwentytwo/sizey-recommendation.js');
 * };
 *
 * add_action( 'woocommerce_after_add_to_cart_button', 'add_sizey_container', 10, 0 );
 * function add_sizey_container() {
 *   	global $product;
 *   	$id = $product->get_id();
 *
 *       echo '<span data-productId="' . $id . '" id="sizey-container"></span>';
 * };
 *
 */

const variationArticleNumbers = [];
$("[data-variation-ean]").each(function () {
  variationArticleNumbers.push($(this).data("variation-ean"));
});

if (variationArticleNumbers) {
  const sizeyProduct = variationArticleNumbers[0];
  $("#sizey-container").attr("data-productean", sizeyProduct);
}

/*
 * To get the service working you need to add your Sizey APIKEY!
 * You will find your own Sizey APIKEY from your sizey portal account https://portal.sizey.ai/my-apikeys
 * To get your own APIKEY you need to sign-up to Sizey Portal and create your own Customer Account.
 * Add Sizey APIKEY here:
 */
// const APIKEY = $("[data-api-key]").data("api-key") || "replacethis=";
const APIKEY = sizey_api_data.APIKEY || 'TzQzeGZXOU5CQ0RSS1N4TEhyb1k6bTlDNEttUVM=';

/*
 * These are variables you can change, but is not mandatory. This script will automatically
 * create a link that opens a recommendation process.
 */
const RECOMMENDATION_LINK_TEXT =
  $("[data-text]").data("text") || "Test your size";
const RECOMMENDATION_BUTTON_TEXT = ("Test My Size"); 
const RECOMMENDATION_TEXT = "Your size recommendation is $SIZE";
const RECOMMENDATION_NOTFOUND_TEXT =
  "Unable to get recommendation for this product.";

/* 
if your web-shop (and brand) is using UPC or EAN code for product variation you can use the following query to find size chart match for your variations
*/
const hasSizeyChart = async (upc) => {
  //     do uncomment when you have API working or after replacing this with working API
  const product = await fetch("https://vroom-api.sizey.ai/products/" + upc, {
    headers: { "x-sizey-key": APIKEY },
  })
    .then((o) => o.json())
    .catch((err) => ({}));
  return !!product?.sizeChart?.id;
  // return 2012;
};

/*
If your web-shop is using internal (non general) product id, then you can use the follwowing query for size chart match 
*/

/*
const hasSizeyChart = async (productId) => {
	const product = await fetch('https://vroom-api.sizey.ai/products/' + productId, { headers: { 'x-sizey-key': APIKEY } }).then(o => o.json()).catch(err => ({}));
    return !!product?.sizeChart?.id;
}
*/

// choose either one for your needs!!

/* 
if your web-shop (and brand) is using UPC or EAN code for product variation you can use the following query size recommendation for your products
*/

const openRecommendationPopup = (upc) => {
  window.open(
    `https://my.sizey.ai/recommendation?&apikey=${APIKEY}&upc=${upc}`,
    "",
    "width=800,height=800"
  );
};

/* 
if your web-shop (and brand) is using internal (non general) product id, then you can use the following query size recommendation for your products
*/

/*
const openRecommendationPopup = (pid) => {
    window.open(`https://my.sizey.ai/recommendation?&apikey=${APIKEY}&productId=${pid}`, "", "width=800,height=800");
​
*/

// choose either one for your needs!!

const registerMessageListener = (callback) => {
  window.onmessage = (e) => {
    const mv = e.data;
    if (mv.event === "sizey-recommendations") {
      callback(mv?.recommendations[0].size);
    }
  };
};

window.addEventListener("load", async (event) => {
  const article = document.querySelector("#sizey-container");
  if (!article) {
    console.log("sizey-container not found.");
    return;
  }
  const upc = article.dataset.upc;

  if (!upc) {
    console.log("Product ID missing from sizey-container.", article.dataset);
    return;
  }

  registerMessageListener((size) => {
    var recommendationNode = document.querySelector("#sizey-recommendation");
    if (!recommendationNode) {
      recommendationNode = document.createElement("span");
      recommendationNode.id = "sizey-recommendation";
      article.appendChild(recommendationNode);
    }
    if (size) {
      recommendationNode.innerText =
        "\n" + RECOMMENDATION_TEXT.replace(/\$SIZE/g, size);
    } else {
      recommendationNode.innerText = "\n" + RECOMMENDATION_NOTFOUND_TEXT;
    }
  });

  if (await hasSizeyChart(productId)) {
    // const elemnt_type = $("[data-display-type]").data("display-type") || "a";
    const showAsLink = sizey_api_data.showAsLink === 'true';
    var element;
    if (showAsLink) {
    		console.log('coming in if==>');
        	element = document.createElement('a');
        	element.href = '#';
		var elementText = document.createTextNode(RECOMMENDATION_LINK_TEXT);
		element.appendChild(elementText);
    	} else {
		    console.log('coming in else==>');
        element = document.createElement('button');
        element.style.backgroundColor = 'blue';
    		element.style.color = 'white';
    		element.style.border = 'none';
    		element.style.fontSize = '12px';
    		element.style.fontFamily = 'sans-serif';
		    var elementText = document.createTextNode(RECOMMENDATION_BUTTON_TEXT);
	    	element.appendChild(elementText);
    	}
	    element.id = "open-sizey";

      a.onclick = (ev) => {
        var recommendationNode = document.querySelector("#sizey-recommendation");
        if (recommendationNode) {
          recommendationNode.innerText = "";
        }

      openRecommendationPopup(upc);
      ev.preventDefault();
    };
    article.appendChild(a);
  }
});
