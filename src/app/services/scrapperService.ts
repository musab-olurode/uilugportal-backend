import cheerio from 'cheerio';
import { IIdTokens } from '../../interfaces/IdTokens';
import { IResult } from '../../interfaces/Result';
import { IUserProfile } from '../../interfaces/UserProfile';

export const scrapIdTokens = (dashboard: string): IIdTokens => {
  let data: IIdTokens = {
    r_val: '',
    id: '',
    p_id: '',
  };

  let $dashboard = cheerio.load(dashboard);

  $dashboard('[title="PERSONAL SETUP"]')
    .find('a')
    .map((i, el) => {
      let item = $dashboard(el).attr('href');
      let params = item?.toString().split('?')[1];
      let firstValues = params?.split('&');
      if (i === 1) {
        data.r_val = firstValues?.[0].split('r_val=')[1] as string;
        data.id = firstValues?.[1].split('id=')[1] as string;
      } else if (i === 2) {
        data.p_id = firstValues?.[1].split('p_id=')[1] as string;
      }
    });

  return data;
};

export const scrapUserProfile = (
  dashboard: string,
  profile: string
): IUserProfile => {
  let $dashboard = cheerio.load(dashboard);
  let $profile = cheerio.load(profile);

  let dashboardData = $dashboard('#content')
    .find('td')
    .map((i, el) => $dashboard(el).text())
    .toArray();

  let images = $profile('#content')
    .find('img')
    .map((i, el) => $profile(el).attr('src'))
    .toArray();

  let profileData = $profile('#content')
    .find('td')
    .map((i, el) => $profile(el).text())
    .toArray();

  // eslint-disable-next-line quotes
  let semester = $dashboard("[color='green']")
    .map((i, elem) => {
      if (i === 3) return $dashboard(elem).text();
    })
    .toArray();
  let semesterParts = semester[0].toString().split(' ');

  let userProfile: IUserProfile = {
    avatar: images[1].toString().trim(),
    signature: images[2].toString().trim(),
    matricNumber: profileData[2].toString().trim(),
    fullName: profileData[4].toString().trim(),
    session: profileData[5].toString().trim(),
    faculty: profileData[6].toString().trim(),
    department: profileData[7].toString().trim(),
    course: profileData[8].toString().trim(),
    level: profileData[3].toString().trim(),
    gender: profileData[9].toString().trim(),
    address: profileData[10].toString().trim(),
    studentEmail: profileData[11].toString().trim(),
    phoneNumber: profileData[12].toString().trim(),
    modeOfEntry: profileData[13].toString().trim(),
    studentShipStatus: profileData[14].toString().trim(),
    chargesPaid: profileData[15].toString().trim(),
    dateOfBirth: profileData[16].toString().trim(),
    stateOfOrigin: profileData[17].toString().trim(),
    lgaOfOrigin: profileData[18].toString().trim(),
    levelAdviser: {
      fullName: dashboardData[8].toString().trim(),
      email: dashboardData[9].toString().trim(),
      phoneNumber: dashboardData[10].toString().trim(),
    },
    nextOfKin: {
      fullName: profileData[21].toString().trim(),
      address: profileData[22].toString().trim(),
      relationship: profileData[23].toString().trim(),
      phoneNumber: profileData[24].toString().trim(),
      email: profileData[25].toString().trim(),
    },
    guardian: {
      name: profileData[27].toString().trim(),
      address: profileData[28].toString().trim(),
      phoneNumber: profileData[29].toString().trim(),
      email: profileData[30].toString().trim(),
    },
    sponsor: {
      fullName: profileData[32].toString().trim(),
      address: profileData[33].toString().trim(),
      phoneNumber: profileData[34].toString().trim(),
      email: profileData[35].toString().trim(),
    },
    semester: {
      type: semesterParts[0].trim(),
      number: semesterParts[1].replace(/\(|\)/g, '').trim().charAt(0),
      year: semesterParts[3].trim(),
    },
  };

  return userProfile;
};

export const scrapResults = (resultsPage: string): IResult[] => {
  let $ = cheerio.load(resultsPage);

  let semester = '';

  // eslint-disable-next-line quotes
  let results = $("[rules='all']")
    .find('tr')
    .map((i, el) => {
      let result: IResult = {
        semester: '',
        code: '',
        title: '',
        unit: '',
        status: '',
        ca: '',
        exam: '',
        total: '',
        grade: '',
      };
      let items = $(el)
        .find('td')
        .map((i2, el2) => $(el2).text())
        .toArray();
      if (items.length === 1) {
        semester = items[0].toString().trim();
      }
      if (items.length > 2 && items[1].toString().trim() !== 'Code') {
        result.semester = semester;
        result.code = items[1].toString().trim();
        result.title = items[2].toString().trim();
        result.unit = items[3].toString().trim();
        result.status = items[4].toString().trim();
        result.ca = items[5].toString().trim();
        result.exam = items[6].toString().trim();
        result.total = items[7].toString().trim();
        result.grade = items[8].toString().trim();
        return result;
      }
    })
    .toArray() as unknown as IResult[];

  return results;
};

export const scrapPaymentReceipts = (receiptsPage: string) => {
  let $ = cheerio.load(receiptsPage);

  let paymentReceipts: any[] = [];

  $('table').map((i, elem) => {
    if (i === 1) {
      $(elem)
        .find('tr')
        .map((i2, el2) => {
          let row = $(el2).find('td').toArray();
          let hrefs = $(row[2]).find('a').toArray();
          let rowObject = {
            session: $(row[1]).text(),
            name: $(row[2]).text(),
            href: $(hrefs[0]).attr('href'),
          };
          if (rowObject.href) {
            paymentReceipts.push(rowObject);
          }
        })
        .toArray();
    }
  });

  return paymentReceipts;
};
