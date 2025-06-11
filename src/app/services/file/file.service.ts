import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/files`;
  constructor(private http: HttpClient) {}
  downloadFile(
    contractId: number | undefined,
    fileId: number
  ): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fileId}/download`, {
      responseType: 'blob',
    });
  }
}
