
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
}

function downloadButtonClicked(el) {
    let text = ''
    try {
        let json = JSON.parse(el.dataset.content)
        text = formatForLogseq(json.blocks)
    }
    catch(e) {
        text = 'Error'
    }

    copyTextToClipboard(text)

    el.classList.add('disabled')
    el.innerText = "Copied to Clipboard!"
    setTimeout(() => {
        el.classList.remove('disabled')
        el.innerText = "Download"
    }, 5000)
}

function formatForLogseq(blocks) {
    let text = ''
    blocks.forEach(block => {
        for(var i = 0; i < block.level; i++) {
            text += '\t';
        }
        text += '- ';
        text += block.content + "\n"
        text += formatForLogseq(block.children)
    })
    return text
}
