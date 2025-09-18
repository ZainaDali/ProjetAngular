import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    service = new NotificationsService();
  });

  it('ajoute une notification', () => {
    service.succes('Bravo');
    expect(service.liste().length).toBe(1);
    expect(service.liste()[0].message).toBe('Bravo');
  });

  it('supprime une notification', () => {
    service.succes('Test');
    const id = service.liste()[0].id;
    service.remove(id);
    expect(service.liste().length).toBe(0);
  });
});
