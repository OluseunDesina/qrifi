import { Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  elementType: any = "img"
  ssid: string = '';
  password: string = '';
  networkType: string = 'WPA';
  hidden: boolean = false;
  qrLoading: boolean = false;
  qrCode: any = "";
  netWorkTypeArray: any[] = [
    {
      name: "WPA/WPA2-EAP/WPA3",
      value: "WPA"
    },
    {
      name: "WEP",
      value: "WEP"
    },
    {
      name: "None",
      value: "nopass"
    },
  ]

  title = 'qrifi';
  errorMessage: string = "";
  qrCodeDownloadLink: SafeUrl | undefined;


  get disableButton() {
    if (this.ssid == '' && (this.password == '' && this.networkType=='nopass')) {
      this.ssid == '' ? this.errorMessage = "SSID cannot be empty" : this.errorMessage = 'Password cannot be empty'
      return;
    }
    return false;
  }

  onChangeURL(url :SafeUrl) {
    this.qrCodeDownloadLink = url
  }

  saveAsImage(parent: any) {
    let parentElement = null

    if (this.elementType === "canvas") {
      // fetches base 64 data from canvas
      parentElement = parent.qrcElement.nativeElement
        .querySelector("canvas")
        .toDataURL("image/png")
    } else if (this.elementType === "img" || this.elementType === "url") {
      // fetches base 64 data from image
      // parentElement contains the base64 encoded image src
      // you might use to store somewhere
      parentElement = parent.qrcElement.nativeElement.querySelector("img").src
    } else {
      alert("Set elementType to 'canvas', 'img' or 'url'.")
    }

    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = "Qrcode"
      link.click()
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }

  onGenereateQR() {
    this.errorMessage = "";
    if (this.ssid == '' || (this.password == '' && this.networkType!='nopass')) {
      this.ssid == '' ? this.errorMessage = "SSID cannot be empty" : this.errorMessage = 'Password cannot be empty'
      return;
    }
    this.qrLoading = true;
    this.qrCode = `WIFI:T:${this.networkType};S:${this.ssid};P:${this.password};H:${this.hidden};;`
    this.qrLoading = false
  }
}
