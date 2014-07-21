// here's a simple script
// 1-1 draw/show a div with a phone number (get a phone number?)
// 1-2 add listener for call: respond with pt2 XML
// 1-3 add listener for call: go to 2.1
// 2-1 clear listeners
// 2-2 add listener for call.keypress: respond with pt3 XML
// 2-3 add listener for call.keypress: go to 3.1
// 2-4 add listener for call.hangup 
// 2-5 clear ui
// 2-6 load and play plane video
// 3-1 clear listeners
// 3-2 add listener for call.hangup 
// 3-3 load and play house video
{
1-1:"showPhone",
1-2:"callListener1-2",
1-3:"callListener1-3",
2-1:"clearListeners",
2-2:"callListener2-2",
2-3:"callListener2-3",
2-4:"callListener2-4",
2-5:"clearUI",
2-6:"playVideo2-6",
3-1:"clearListeners",
3-2:"callListener3-2",
3-3:"playVideo3-3",
}