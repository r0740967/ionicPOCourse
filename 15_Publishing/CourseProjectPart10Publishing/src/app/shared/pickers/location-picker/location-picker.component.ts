import { HttpClient } from "@angular/common/http";
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from "@ionic/angular";
import { MapModalComponent } from "../../map-modal/map-modal.component";
import { environment } from "../../../../environments/environment";
import { map, observeOn, switchMap } from "rxjs/operators";
import { Coordinates, PlaceLocation } from "../../../places/location.model";
import { of } from "rxjs";

import { Plugins, Capacitor } from "@capacitor/core";

@Component({
  selector: "app-location-picker",
  templateUrl: "./location-picker.component.html",
  styleUrls: ["./location-picker.component.scss"],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string;
  isLoading: boolean = false;
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview:boolean=false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: "Please Choose",
        buttons: [
          {
            text: "Auto-Locate",
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: "Pick on Map",
            handler: () => {
              this.openMap();
            },
          },
          { text: "Cancel", role: "cancel" },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable("Geolocation")) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition()
      .then((geoPosition) => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch((err) => {
        this.showErrorAlert();
        this.isLoading = false;
      });
  }

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: "Could not fetch location",
        message: "Please use the map to pick a location!",
        buttons: [{text: 'Okay'}]
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  private openMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
      })
      .then((modelEl) => {
        modelEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
          };
          this.createPlace(coordinates.lat, coordinates.lng);
        });
        modelEl.present();
      });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null,
      staticMapImageUrl: null,
    };

    this.isLoading = true;
    this.getAddress(lat, lng)
      .pipe(
        switchMap((address) => {
          pickedLocation.address = address;
          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe((staticMapImageUrl) => {
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        this.selectedLocationImage = staticMapImageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
      )
      .pipe(
        map((geoData: any) => {
          if (!geoData || !geoData.results || geoData.results.length == 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300
    &markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsAPIKey}`;
  }
}
