BiTs A tool for enriching your security investigation experience within the browser. 

This App is currently in Alpha and still under development 

Current Features:

-Trustar known indicator search
-Base 64 Decoder
-IP enrichment search
-IOC Extractor
-Security News (threatpost)
-context menu containing quick page links to rax internal/external sources

Installation:
Extract the ZIP to your target directory.
Within the directory containing the extracted code navigate to /modules and rename config_sample.json to config.json

To make used of advanced functionality you will need to add API Keys and enable them. 
in config JSON add your API Keys for Trustar, Greynoise, Virustotal and shodan and Set enabled to True


Chrome:
in chrome navigate to chrome://extensions/ in the top right enable developer mode
select load unpacked extension and navigate to the target folder containing the extension and select open.


Firefox:
Currently not fully supported and many of the advanced features do not fully work. plugin is also not persistant in firefox due to been in development and not packaged. 

in firefox navigate to about:debugging#/runtime/this-firefox 
on the page select load temporary add-on 
navigate to the folder containing the plugin source and select and file

You will recieve a number of warnings this is due to incompatibilities 


Operation

Context Search:

select a value of intrest such as a IP , account number , device ID, hash , domain etc right click and navigate to Bitsweb menu here you will be presented with a number of options including open source resources and rax specific. clicking the link will navigate to that page in a seperate browser and lookup the highlighted value. 

Popup Menu features:

Highlight a value or text chunk and select the bits web icon from the the extensions menu. select an option from the botom menu:

Star Icon - performs Truestar lookup. Will try to automatically search for selected text blob however this can fail on some pages so there is the option to manually enter data. once search completes the output will automatically be copied to the clipboard. 

Alien Icon - Base 64 decoder. will auto try to decode any base 64 strings in the selected text blob. and also has the option for manually entering strings to decode. the decoded strings will automatically be copied to the clipboard. 

magnifier icon - IOC enrichment (currently IP only) looks up enrichment data on IPs in selected text blob. output is automatically copied to clipboard but also is a manual copy button. Option to manually enter IPs and search

paper icon - News feed currently only pulls in threatpost articles. 

bug icon - IOC extractor will take a selected text blob and extract IPs, Domains , Hashes and b64 strings and provide these in a bulleted list. Output is automatically copied to clipboard. 

Theme change icon- changes theme currently is Dark mode, rax mode and matrix green. 

Known issues:

Auto copy does not work within service now
output formatting is a tad wonky
no validation on strings in context searches

Future enhanments:

Defang output option 
Hash / DNS enrichment searches
Better formatting
settings menu
packaged plugin
