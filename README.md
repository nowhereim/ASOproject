# 💗 코드 네임 : 환승 시민 🚆 💗

" 둘이 어떻게 만났어? "

### " 우린 1호선에서 만났어. "

<img alt="킹받는꼬맹이1" style="display: block; margin:0 auto; width:300px" src="https://res.cloudinary.com/dtkt6x68f/image/upload/v1668988410/github/60dcb93b1c5f46364f60f488b70aff9e_res_pwjpia.jpg"> <br>
<img alt="킹받는꼬맹이2" style="display: block; margin:0 auto; width:200px" src="https://res.cloudinary.com/dtkt6x68f/image/upload/v1668989263/github/3f394bc730abad7b4a07afa44112a444_res_agshcz.jpg">

## 환승 시민 프로젝트 구성원

백엔드 팀 `BE`  
|팀내 포지션| 한 줄 소개 | 이름 | 깃허브 | 블로그 |
|--------|----------|-------|------|-------|
|리더| 레드 어몽이 |안태환|https://github.com/nowhereim|
|팀원| 마약 옥수수 |성용환|https://github.com/tlptop|
|팀원| 잇몸 알파카 |오윤지|https://github.com/doodlerrr|

프론트엔드 팀 `FE`
|팀내 포지션| 한 줄 소개 | 이름 | 깃허브 | 블로그 |
|--------|----------|-------|------|-------|
|부리더| |김재우 |https://github.com/wyswhsl21|||
|팀원 | |남해리|https://github.com/NSunR|||
|팀원 | |이상현|https://github.com/shlee1027|||

## API 명세서

아래는 API 명세서 입니다.
| \_ | Method | URI | REQUEST | RESPONSE | 추가 설명 |
|--------|---------|----------|-----------|------------|---------|
|가입 초기 필수 입력 정보 받기|POST|/user| { representProfile: 이미지파일, nickname: "yuyu", phone: "01022760716", gender: false} |{ msg: "가입 되었습니다" }|대표 프로필 및 유저정보 초기값 업로드, `인증 토큰 필수`|
|SMS인증문자발송|POST|/auth/phone|{phone:"01022760716"}|{ msg: "인증 메시지를 전송했습니다"}|인증번호 유효시간 2분|
|SMS인증번호비교(검증)|POST|/auth/compare| { phone:"01022760716", auth : "ak2435" }|{ status: 200, statusMassage: "ok, 전송되었습니다."}|-|
|마이 프로필 업데이트| POST | /profile | { representProfile: 이미지파일, profileImage: [이미지파일], nickname: "jiji", statusmessage: "멋쟁이 4조" } | { status: 200, msg: "유저 프로필 정보가 수정되었습니다"}| `인증 토큰 필수` |
|마이 프로필 조회 | GET | /profile | - | { msg: "유저 프로필이 조회되었습니다", body: userProfileInfo } | `인증 토큰 필수` |
|마이 프로필 삭제(회원 탈퇴 시)| DELETE | /profile| - | - | `인증 토큰 필수` |

정리할 스토리 몇개

몽고디비 클러스터를 분리함. 매칭을위해 디비에서 동일한 칸의 유저를 수시로 찾는 디비클러스터를 따로 분리함.
======= 이로인한 다른 서비스로직에 부하로인한 영향을 주지 않음 =====

단일 ec2인스턴스를 사용하고있던 중에
한곳으로 많은 트래픽이 몰리게 되자 (초당 100) cpu를 풀로드 하고있었고
홈페이지 로딩속도가 느려지고 버튼을 클릭 할 시 레이턴시가 5~10초가량 발생하기 시작하였습니다. 쌓이는 트래픽에 레이턴시는 시간에 비례하여 점점 증가하는 상황이었습니다.

초당 100건은 지속적이며, 안정적으로 처리시켜야함을 목표로 진행하였고 예기치못하게 트래픽이 순간적으로 급증하는 상황에서도 서버가 견딜수있게 기존 서비스 목표치의 2~3배를 최종 범위로 설정하였던 상황이라 현 상태를 빠르게 해소해야 할 필요를 느끼게되었습니다.

이러한 상황에서
스펙업은 현 상황에서 더 많은 부하가 쏟아짐을 가정하였을 때 투자비용대비 그 효율이 정비례하지않는다고 판단하게되어 스케일아웃을통해 정확히 필요에의해서만 비용이발생하고 성능을 확장시킬수있게 하고자 하였습니다.

ELB 엘라스틱 로드밸런서를 이용하여 트래픽을 한곳에서 감당하지 않고 분산시킬수 있도록 하고 오토스케일링을 적용시켜 50% 이상의 cpu 사용을 지속하게 될 경우 자동으로 스케일아웃을 하고 그렇지않을경우 다시 인스턴스를 줄여 트래픽분산과 불필요하게 과도한 비용청구를 피함으로써 두가지 이득을 모두 취하였습니다.

DB 또한 기존에 하나의 클러스터에서 모든 오퍼레이션을 수행하던 방식에서
가장 i/o가 많이 일어나는 매칭 부분을 분리시켜 별도의 클러스터에서 처리하게 하고
수시로 유저정보를 찾아야하는 프로필조회와 같은 부분들을 위해 인덱싱처리를 해줌으로써
불필요한 탐색을 줄이고 속도를 향상시킬수있게 하였습니다.
